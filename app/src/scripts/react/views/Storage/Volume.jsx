// ZFS POOL / VOLUME ITEM
// ======================
// Individual item which represents a ZFS pool and its associated volume.
// Contains the datasets, ZVOLs, and other high level objects that are
// properties of the pool.

"use strict";

import _ from "lodash";
import React from "react/addons";
import TWBS from "react-bootstrap";

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

const Volume = React.createClass(
  { displayName: "Volume"

  , propTypes:
    { availableDisks  : React.PropTypes.array.isRequired
    , availableSSDs   : React.PropTypes.array.isRequired
    , existsOnRemote  : React.PropTypes.bool
    , data            : React.PropTypes.array
    , logs            : React.PropTypes.array
    , cache           : React.PropTypes.array
    , spares          : React.PropTypes.array
    , datasets        : React.PropTypes.array
    , name            : React.PropTypes.string
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

  , handleDiskAdd ( vdevKey, purpose, event ) {
      let vdevCollection = this.state[ purpose ];
      let targetVdev = vdevCollection[ vdevKey ];

      switch ( targetVdev.type ) {
        // All non-disk vdevs will just need the new disk added to their children.
        case "raidz3" :
        case "raidz2" :
        case "raidz1" :
        case "mirror" :
          targetVdev.children.push( this.createNewDisk( event.target.value ) );
          break;

        case "disk" :
          targetVdev.type = "mirror";
          targetVdev.children = [ this.createNewDisk( targetVdev.path )
                                , this.createNewDisk( event.target.value )
                                ];
          targetVdev.path = null;
          break;

        // Fresh Vdev with no type becomes a disk and obtains the target as its
        // path.
        default:
          targetVdev = this.createNewDisk( event.target.value );
          break;
      }

      vdevCollection[ vdevKey ] = targetVdev;

      // newSelectedDisks.push( event.target.value );
      // newSelectedDisks = newSelectedDisks.sort();

      this.setState( { [ purpose ] : vdevCollection } );
    }

  , handleDiskRemove ( volumeKey, vdevPurpose, vdevKey, diskPath ) {
      let newSelectedDisks = [];
      let newVdev = this.state[ "volumes" ]
                              [ volumeKey ]
                              [ "topology" ]
                              [ vdevPurpose ]
                              [ vdevKey ];

      switch ( newVdev.type ) {

        case "raidz3" :
          if ( newVdev.children.length === 5 ) {
            newVdev.children = _.without( newVdev.children, diskPath );
            newVdev.type = "raidz2";
          } else {
            newVdev.children = _.without( newVdev.children, diskPath );
          }
          break;

        case "raidz2" :
          if ( newVdev.children.length === 4 ) {
            newVdev.children = _.without( newVdev.children, diskPath );
            newVdev.type = "raidz1";
          } else {
            newVdev.children = _.without( newVdev.children, diskPath );
          }
          break;

        case "raidz1" :

          if ( newVdev.children.length === 3 ) {
            newVdev.children = _.without( newVdev.children, diskPath );
            newVdev.type = "mirror";
          } else {
            newVdev.children = _.without( newVdev.children, diskPath );
          }
          break;

        case "mirror" :
          if ( newVdev.children.length === 2 ) {
            newVdev.path = _.without( newVdev.children, diskPath )[0][ "path" ];
            newVdev.children = [];
            newVdev.type = "disk";
          } else {
            newVdev.children = _.without( newVdev.children, diskPath );
          }
          break;

        case "disk" :
          newVdev.children = [];
          newVdev.path = null;
          newVdev.type = null;
          break;

        default:
          break;
      }

      newVolumes[ volumeKey ][ "topology" ][ vdevPurpose ][ vdevKey ] = newVdev;
      newSelectedDisks = _.without( this.state.selectedDisks, diskPath );

      this.setState( { volumes: newVolumes
                     , selectedDisks: newSelectedDisks
                     }
                   );
    }

  , handleVdevAdd ( purpose ) {
      // This will be more sophisticated in the future.
      let vdev = [
          { children : []
          , path     : null
          , type     : null
          }
        ];

      this.setState(
        { [purpose] : update( this.state[ purpose ]
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
              type = "text"
              onChange = { this.handleVolumeNameChange }
              placeholder = "Volume Name"
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
              handleVdevAdd        = { this.handleVdevAdd }
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
      let breakdown   = null;
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
        let freeSize      = ByteCalc.convertString( this.props.free );
        let allocatedSize = ByteCalc.convertString( this.props.allocated );
        let totalSize     = ByteCalc.convertString( this.props.size );

        volumeInfo = (
          <div className="volume-info clearfix">
            { this.createVolumeName() }
            <h3 className="pull-right volume-capacity">
              { ByteCalc.humanize( totalSize ) }
            </h3>
          </div>
        );

        breakdown = (
          <BreakdownChart
            free   = { freeSize }
            used   = { allocatedSize }
            parity = { totalSize / 4 /* FIXME */ }
            total  = { totalSize }
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
          { breakdown }
          { drawer }
        </TWBS.Panel>
      );
    }

  }
);

export default Volume;
