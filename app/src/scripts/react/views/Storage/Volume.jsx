// ZFS POOL / VOLUME ITEM
// ======================
// Individual item which represents a ZFS pool and its associated volume.
// Contains the datasets, ZVOLs, and other high level objects that are
// properties of the pool.

"use strict";

import _ from "lodash";
import React from "react/addons";
import TWBS from "react-bootstrap";

import DS from "../../../flux/stores/DisksStore";

import ByteCalc from "../../../utility/ByteCalc";

import BreakdownChart from "./Volumes/BreakdownChart";
import PoolDatasets from "./Volumes/PoolDatasets";
import PoolTopology from "./Volumes/PoolTopology";

const SLIDE_DURATION = 500;
const NAV_STATES = new Set( [ "disks", "filesystem", "snapshots", "files" ] );

const { update } = React.addons;

// VOLUME EDITING
// ==============
// The editing reconciliation model for Volume relies on the difference
// between state and props. As with a simple form, the intial values are set
// by props. Subsequent modifications to these occur in state, until an
// update task is performed, at which time the new props will be assigned, and
// each mutable value in state is exactly equal to its counterpart in props.
// This pattern is also used to compare user-submitted values to upstream
// changes. In componentWillUpdate, if we can see that the current props and
// state have the same value for a given key, we can update the entry in the
// client's representation without conflict. In the case that these values are
// unequal, we can choose instead to display a warning, indicate that another
// user has modified that field, etc. As always, the last change "wins".

const VDEV_TYPES = [ "disk", "mirror", "raidz1", "raidz2", "raidz3" ];

const Volume = React.createClass(
  { displayName: "Volume"

  , propTypes:
    { handleEditModeChange : React.PropTypes.func.isRequired
    , handleDiskSelection  : React.PropTypes.func.isRequired
    , handleDiskRemoval    : React.PropTypes.func.isRequired
    , availableDisks       : React.PropTypes.array.isRequired
    , availableSSDs        : React.PropTypes.array.isRequired
    , existsOnRemote       : React.PropTypes.bool
    , data                 : React.PropTypes.array
    , logs                 : React.PropTypes.array
    , cache                : React.PropTypes.array
    , spares               : React.PropTypes.array
    , datasets             : React.PropTypes.array
    , name                 : React.PropTypes.string
    , free: React.PropTypes.oneOfType(
        [ React.PropTypes.string
        , React.PropTypes.number
        ]
      )
    , allocated: React.PropTypes.oneOfType(
        [ React.PropTypes.string
        , React.PropTypes.number
        ]
      )
    , size: React.PropTypes.oneOfType(
        [ React.PropTypes.string
        , React.PropTypes.number
        ]
      )
    }

  , getDefaultProps () {
      return { existsOnRemote : false
             , data           : []
             , logs           : []
             , cache          : []
             , spares         : []
             , free           : 0
             , allocated      : 0
             , size           : 0
             };
    }

  , returnInitialStateValues () {
      return { activeSection : null
             , editing       : false
             , data          : this.props.data
             , logs          : this.props.logs
             , cache         : this.props.cache
             , spares        : this.props.spares
             , free          : this.props.free
             , allocated     : this.props.allocated
             , size          : this.props.size
             };
    }

  , getInitialState () {
      return this.returnInitialStateValues();
    }

  // A shorthand method used to "cancel" creation or editing of a volume.
  // TODO: This should probably be gated so that it isn't triggered without a
  // warning to the user.

  , componentDidUpdate ( prevProps, prevState ) {
      let sectionIsVisible       = Boolean( prevState.activeSection );
      let sectionShouldBeVisible = Boolean( this.state.activeSection );

      // Toggle the display of the content drawer
      if ( sectionIsVisible !== sectionShouldBeVisible ) {
        if ( sectionShouldBeVisible ) {
          Velocity( React.findDOMNode( this.refs.drawer )
                  , "slideDown"
                  , SLIDE_DURATION
                  );
        } else {
          Velocity( React.findDOMNode( this.refs.drawer )
                  , "slideUp"
                  , SLIDE_DURATION
                  );
        }
      }
    }

  , enterEditMode ( event ) {
      this.props.handleEditModeChange( true, event );
      this.setState({ editing: true });
    }

  , handlePanelOpen () {
      this.setState({ activeSection: "disks" });
    }

  , handleNavSelect ( keyName ) {
      if ( NAV_STATES.has( keyName ) ) {
        this.setState({ activeSection: keyName });
      } else {
        this.setState({ activeSection: null });
      }
    }

  , createNewDisk ( path ) {
      return ( { path: path
               , type: "disk"
               , children: []
               }
      );
    }

  , calcVdevType( allowedTypes, currentType ) {
      if ( _.has( allowedTypes, currentType ) ) {
        return currentType;
      } else {
        return _.last( allowedTypes );
      }
    }

  , caluclateBreakdown() {
      let breakdown =
        { parity : 0
        , avail  : 0
        };

      this.state.data.forEach( vdev => {
        if ( vdev.type ) {
          let baseSize = DS.getSmallestDisk(
            this.getMemberDiskPaths( vdev )
          )["byteSize"];

          switch ( vdev.type ) {
            case "disk":
              breakdown.parity += 0;
              breakdown.avail  += baseSize;
              break;

            case "mirror":
              breakdown.parity += baseSize * ( vdev.children.length - 1 );
              breakdown.avail  += baseSize;
              break;

            case "raidz1":
              breakdown.parity += baseSize * 1;
              breakdown.avail  += ( baseSize * vdev.children.length )
                                - breakdown.parity;
              break;

            case "raidz2":
              breakdown.parity += baseSize * 2;
              breakdown.avail  += ( baseSize * vdev.children.length )
                                - breakdown.parity;
              break;

            case "raidz3":
              breakdown.parity += baseSize * 3;
              breakdown.avail  += ( baseSize * vdev.children.length )
                                - breakdown.parity;
              break;
          }
        }
      });

      return breakdown;
    }

  , getMemberDiskPaths( collection ) {
      let paths = [];

      if ( collection ) {
        if ( collection.type === "disk" ) {
          paths.push( collection.path );
        } else {
          paths = _.pluck( collection.children, "path" );
        }
      }

      return paths;
    }

  , formatVdev ( purpose = null, disks = [], currentType = null ) {
      let allowedTypes = [];
      let newVdev;

      if ( disks.length === 1 ) {
        allowedTypes.push( VDEV_TYPES[0] );
        newVdev = this.createNewDisk( disks[0] );
      } else if ( disks.length > 1 ) {
        // This might look "too clever" at first, but it's very simple. The
        // VDEV_TYPES array contains 5 entries, from "disks" to "raidz3". To
        // have three parity drives for a VDEV, you need to have two data disks.
        // If you only have one, then what you actually have is a four-way
        // mirror. This holds true for Z2 and Z1, all the way down to the case
        // where you have two disks, and your only option is to mirror or stripe
        // them (but striping is bad and we might want to not allow it in
        // certain "purposes", like data ).
        allowedTypes.push(
          ...VDEV_TYPES.slice( 1, disks.length )
        );
        newVdev =
          { path     : null
          , type     : this.calcVdevType( allowedTypes, currentType )
          , children : _.sortBy( disks ).map( this.createNewDisk )
          };
      } else {
        newVdev =
          { path     : null
          , type     : null
          , children : []
          };
      }

      return { vdev         : newVdev
             , allowedTypes : allowedTypes
             };
    }

  , handleDiskAdd ( vdevKey, vdevPurpose, event ) {
      let collection  = this.state[ vdevPurpose ][ vdevKey ];
      let currentType = null;
      let vdevDisks   = [ event.target.value ];

      if ( collection ) {
        currentType = collection.type;
        vdevDisks.push( ...this.getMemberDiskPaths( collection ) );
      }

      let formatted = this.formatVdev( vdevPurpose, vdevDisks, currentType );

      this.props.handleDiskSelection( event.target.value );
      this.setState(
        { [ vdevPurpose ]:
            update( this.state[ vdevPurpose ]
                  , { [ vdevKey ]: { $set: formatted.vdev } }
          )
        }
      );
    }

  , handleDiskRemove ( vdevKey, vdevPurpose, diskPath ) {
      let collection  = this.state[ vdevPurpose ][ vdevKey ];
      let currentType = null;
      let vdevDisks   = [];

      if ( collection ) {
        currentType = collection.type;
        vdevDisks.push(
          ..._.without( this.getMemberDiskPaths( collection ), diskPath )
        );
      }

      let formatted = this.formatVdev( vdevPurpose, vdevDisks, currentType );

      this.props.handleDiskRemoval( diskPath );
      this.setState(
        { [ vdevPurpose ]:
            update( this.state[ vdevPurpose ]
                  , { [ vdevKey ]: { $set: formatted.vdev } }
          )
        }
      );
    }

  , handleVdevAdd ( vdevPurpose ) {
      // This will be more sophisticated in the future.
      let vdev = [
          { children : []
          , path     : null
          , type     : null
          }
        ];

      this.setState(
        { [ vdevPurpose ] : update( this.state[ vdevPurpose ]
                            , { $push: vdev }
                            )
        }
      );

    }

  , handleVdevRemove () {
      // TODO
    }

  , handleVdevTypeChange () {
      // TODO
    }

  , handleVolumeNameChange () {
      // TODO
    }

  , resetVolume () {
      this.setState( this.returnInitialStateValues() );
    }

  , submitVolume () {
      // TODO
    }

  , createVolumeName () {
      if ( this.state.editing ) {
        return (
          <div className="volume-name-input">
            <TWBS.Input
              type        = "text"
              placeholder = "Volume Name"
              onChange    = { this.handleVolumeNameChange }
              value       = { this.state.name }
            />
          </div>
        );
      } else {
        return (
          <h3 className="pull-left volume-name">{ this.state.name }</h3>
        );
      }
    }

  , createDrawerContent () {
      switch ( this.state.activeSection ) {
        case "disks":
          return (
            <PoolTopology
              availableDisks       = { this.props.availableDisks }
              availableSSDs        = { this.props.availableSSDs }
              data                 = { this.state.data }
              logs                 = { this.state.logs }
              cache                = { this.state.cache }
              spares               = { this.state.spares }
              handleDiskAdd        = { this.handleDiskAdd }
              handleDiskRemove     = { this.handleDiskRemove }
              handleVdevRemove     = { this.handleVdevRemove }
              handleVdevTypeChange = { this.handleVdevTypeChange }
            />
          );
        case "filesystem":
          return (
            <PoolDatasets ref="Storage" />
          );
      }
    }

  , render () {
      let isInitialized = !this.props.existsOnRemote && !this.state.editing;

      let initMessage = null;
      let volumeInfo  = null;
      let chart       = null;
      let drawer      = null;

      if ( isInitialized ) {
        // We can deduce that this Volume is the "blank" one, and that it has
        // not yet been interacted with. We use this state information to
        // display an initialization message.

        initMessage = (
          <div className="text-center">
            <TWBS.Button
              bsStyle = "primary"
              onClick = { this.enterEditMode }
            >
            { "Create new ZFS volume" }
            </TWBS.Button>
          </div>
        );
      } else {
        let breakdown = this.caluclateBreakdown();
        let totalSize;
        let usable;
        let parity;
        let allocated;
        let freeSize;

        if ( this.state.editing ) {
          totalSize = breakdown.avail + breakdown.parity;
          usable    = breakdown.avail
          parity    = breakdown.parity;
          allocated = 0; // FIXME
          freeSize  = breakdown.avail;
        } else {
          totalSize = 0; // FIXME
          usable    = ByteCalc.convertString( this.props.size );
          parity    = 0; // FIXME
          allocated = ByteCalc.convertString( this.props.allocated );
          freeSize  = ByteCalc.convertString( this.props.free );
        }

        volumeInfo = (
          <div className="volume-info clearfix">
            { this.createVolumeName() }
            <h3 className="pull-right volume-capacity">
              { ByteCalc.humanize( usable ) }
            </h3>
          </div>
        );

        chart = (
          <BreakdownChart
            total  = { totalSize }
            parity = { breakdown.parity }
            used   = { allocated }
            free   = { freeSize }
          />
        );

        drawer = (
          <div
            ref     = "drawer"
            style   = {{ display: "none" }}
            onClick = { function ( event ) { event.stopPropagation(); } }
          >
            <TWBS.Nav
              className = "volume-nav"
              bsStyle   = "pills"
              activeKey = { this.state.activeSection }
              onSelect  = { this.handleNavSelect }
            >
              <TWBS.NavItem eventKey="disks">
                {"Disks"}
              </TWBS.NavItem>
              <TWBS.NavItem eventKey="filesystem">
                {"Filesystem"}
              </TWBS.NavItem>
              {/* <TWBS.NavItem>Snapshots</TWBS.NavItem> */}
              {/* <TWBS.NavItem>Files</TWBS.NavItem> */}
            </TWBS.Nav>
            { this.createDrawerContent() }
          </div>
        );
      }

      return (
        <TWBS.Panel
          className = { "volume" + ( isInitialized ? " awaiting-init" : "" ) }
          onClick   = { this.handlePanelOpen }
        >
          { initMessage }
          { volumeInfo }
          { chart }
          { drawer }
        </TWBS.Panel>
      );
    }

  }
);

export default Volume;
