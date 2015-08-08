// ZFS POOL / VOLUME ITEM
// ======================
// Individual item which represents a ZFS pool and its associated volume.
// Contains the datasets, ZVOLs, and other high level objects that are
// properties of the pool.

"use strict";

import _ from "lodash";
import React from "react";
import TWBS from "react-bootstrap";

import DS from "../../../flux/stores/DisksStore";

import EventBus from "../../../utility/EventBus";
import ByteCalc from "../../../utility/ByteCalc";

import BreakdownChart from "./Volumes/BreakdownChart";
import PoolDatasets from "./Volumes/PoolDatasets";
import PoolTopology from "./Volumes/PoolTopology";
import TopologyEditContext from "./Volumes/contexts/TopologyEditContext";

const SLIDE_DURATION = 500;
const NAV_STATES = new Set( [ "disks", "filesystem", "snapshots", "files" ] );

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
    { onEditModeChange: React.PropTypes.func.isRequired
    , handleDiskSelection: React.PropTypes.func.isRequired
    , handleDiskRemoval: React.PropTypes.func.isRequired
    , availableDisks: React.PropTypes.array.isRequired
    , availableSSDs: React.PropTypes.array.isRequired
    , existsOnRemote: React.PropTypes.bool
    , data: React.PropTypes.array
    , logs: React.PropTypes.array
    , cache: React.PropTypes.array
    , spares: React.PropTypes.array
    , datasets: React.PropTypes.array
    , name: React.PropTypes.string
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
             , name          : this.props.name
             // To keep state pure and mimic the schema used by the middleware,
             // allowed types is a parallel data structure that stores
             // information about which VDEV types are allowed. It is created /
             // modified by reconstructVdev(), and passed to PoolTopology for
             // eventual use in VDEV.
             , allowedTypes:
               { data   : []
               , logs   : []
               , cache  : []
               , spares : []
               }
             };
    }

  , getInitialState () {
      return this.returnInitialStateValues();
    }

  , componentWillReceiveProps ( newProps ) {
    this.setState( { name: newProps.name
                   , data : newProps.data
                   , logs : newProps.logs
                   , cache : newProps.cache
                   , spares : newProps.spares
                   , free : newProps.free
                   , allocated : newProps.allocated
                   , size : newProps.size
                   }
                 );
  }

  // A shorthand method used to "cancel" creation or editing of a volume.
  // TODO: This should probably be gated so that it isn't triggered without a
  // warning to the user.

  , componentDidUpdate ( prevProps, prevState ) {
      let sectionIsVisible = Boolean( prevState.activeSection );
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

      if ( this.state.editing
        && _.xor( this.props.availableDisks
                , prevProps.availableDisks ).length
                ) {
        let contextProps =
          { availableDisks: this.props.availableDisks
          };
        EventBus.emit( "updateContextPanel"
                     , TopologyEditContext
                     , contextProps );
      }
    }

  , componentWillUnmount () {
      EventBus.emit( "hideContextPanel", TopologyEditContext );
    }

  , handleEditModeChange ( isEditing, event ) {
      if ( isEditing ) {
        let contextProps =
          { availableDisks: this.props.availableDisks
          };

        this.props.onEditModeChange( true, event );
        EventBus.emit( "showContextPanel", TopologyEditContext, contextProps );
      } else {
        EventBus.emit( "hideContextPanel", TopologyEditContext );
      }

      this.setState({ editing: isEditing });
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
      if ( allowedTypes.indexOf( currentType ) > -1 ) {
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
          let smallestDisk = DS.getSmallestDisk(
            this.getMemberDiskPaths( vdev )
          );

          let baseSize = _.has( smallestDisk, "mediasize" )
                       ? smallestDisk.mediasize
                       : 0;

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

  , reconstructVdev ( key, purpose = null, disks = [], currentType = null ) {
      let purposeVdevs = this.state[ purpose ];
      let allAllowedTypes = this.state.allowedTypes;
      let vdevAllowedTypes = [];
      let newVdev;

      if ( disks.length === 1 ) {
        vdevAllowedTypes.push( VDEV_TYPES[0] );
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
        vdevAllowedTypes.push( ...VDEV_TYPES.slice( 1, disks.length ) );

        newVdev =
          { path     : null
          , type     : this.calcVdevType( vdevAllowedTypes, currentType )
          , children : _.sortBy( disks ).map( this.createNewDisk )
          };
      }

      if ( newVdev ) {
        // One of the above conditions resulted in the creation of a VDEV,
        // potentially including the "empty" VDEV that lives at the end of each
        // bucket.
        purposeVdevs[ key ] = newVdev;
        allAllowedTypes[ purpose ][ key ] = vdevAllowedTypes;
      } else {
        // The alternate outcome is that we have an empty VDEV somewhere in the
        // middle of the bucket - probably because the user removed its disks
        purposeVdevs.splice( key, 1 );
        allAllowedTypes[ purpose ].splice( key, 1 );
      }

      this.setState(
        { [ purpose ]: purposeVdevs
        , allowedTypes: allAllowedTypes
        }
      );
    }

  , vdevOperation( opType, key, purpose, options = {} ) {
      let collection  = this.state[ purpose ][ key ];
      let currentType = null;
      let disks       = opType === "add" && options.path
                      ? [ options.path ]
                      : [];

      if ( collection ) {

        switch ( opType ) {
          case "add":
            currentType = collection.type;
            disks.push( ...this.getMemberDiskPaths( collection ) );
            break;

          case "remove":
            currentType = collection.type;
            disks.push(
              ..._.without( this.getMemberDiskPaths( collection )
                          , options.path
                          )
            );
            break;

          case "changeType":
            currentType = options.type;
            disks.push( ...this.getMemberDiskPaths( collection ) );
            break;
        }
      }

      this.reconstructVdev( key, purpose, disks, currentType );
    }

  , handleDiskAdd ( vdevKey, vdevPurpose, path ) {
      this.props.handleDiskSelection( path );
      this.vdevOperation( "add"
                        , vdevKey
                        , vdevPurpose
                        , { path: path }
                        );
    }

  , handleDiskRemove ( vdevKey, vdevPurpose, path, event ) {
      this.props.handleDiskRemoval( path );
      this.vdevOperation( "remove"
                        , vdevKey
                        , vdevPurpose
                        , { path: path }
                        );
    }

  , handleVdevTypeChange ( vdevKey, vdevPurpose, vdevType, event ) {
      this.vdevOperation( "changeType"
                        , vdevKey
                        , vdevPurpose
                        , { type: vdevType }
                        );
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
              allowedTypes         = { this.state.allowedTypes }
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
              onClick = { this.handleEditModeChange.bind( null, true ) }
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
          usable    = breakdown.avail;
          parity    = breakdown.parity;
          allocated = 0; // FIXME
          freeSize  = breakdown.avail;
        } else {
          totalSize = ByteCalc.convertString( this.props.size ); // FIXME
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
            parity = { parity }
            used   = { allocated }
            free   = { freeSize }
          />
        );

        drawer = (
          <div
            ref     = "drawer"
            style   = {{ display: "none" }}
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
          className = { "volume"
                      + ( isInitialized
                        ? " awaiting-init"
                        : ""
                        )
                      + ( this.state.editing
                        ? " editing"
                        : ""
                        )
                      }
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
