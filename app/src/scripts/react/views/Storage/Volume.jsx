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
import ZM from "../../../flux/middleware/ZfsMiddleware";

import EventBus from "../../../utility/EventBus";
import ByteCalc from "../../../utility/ByteCalc";

import ZfsUtil from "./utility/ZfsUtil";

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

const Volume = React.createClass(
  { displayName: "Volume"

  , propTypes:
    { onEditModeChange: React.PropTypes.func.isRequired
    , handleDiskSelection: React.PropTypes.func.isRequired
    , handleDiskRemoval: React.PropTypes.func.isRequired
    , handleDiskClear: React.PropTypes.func.isRequired
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

  , getInitialState () {
      return { activeSection : null
             , editing       : false
             , data          : []
             , logs          : []
             , cache         : []
             , spares        : []
             , free          : 0
             , allocated     : 0
             , size          : 0
             , name          : ""
             // To keep state pure and mimic the schema used by the middleware,
             // allowed types is a parallel data structure that stores
             // information about which VDEV types are allowed. It is created /
             // modified by reconstructVdev(), and passed to PoolTopology for
             // eventual use in VDEV.
             , allowedTypes:
               { data: []
               , logs: []
               , cache: []
               , spares: []
               }
             };
    }

  // A shorthand method used to "cancel" creation or editing of a volume.
  // TODO: This should probably be gated so that it isn't triggered without a
  // warning to the user.

  , componentDidUpdate ( prevProps, prevState ) {
      let sectionIsVisible = Boolean( prevState.activeSection );
      let sectionShouldBeVisible = Boolean( this.state.activeSection );

      let wasEditing = Boolean( prevState.editing );
      let isEditing = Boolean( this.state.editing );

      // Toggle the display of the content drawer
      if ( sectionIsVisible !== sectionShouldBeVisible ) {
        if ( sectionShouldBeVisible ) {
          Velocity( [ React.findDOMNode( this.refs.drawer )
                    , React.findDOMNode( this.refs.changesToolbar )
                    ]
                  , "slideDown"
                  , SLIDE_DURATION
                  );
        } else {
          Velocity( [ React.findDOMNode( this.refs.drawer )
                    , React.findDOMNode( this.refs.changesToolbar )
                    ]
                  , "slideUp"
                  , SLIDE_DURATION
                  );
        }
      }

      if ( wasEditing !== isEditing ) {
        if ( isEditing ) {
          if ( !this.state.name && this.refs.volumeNameInput ) {
            React.findDOMNode( this.refs.volumeNameInput )
                 .getElementsByTagName( "INPUT" )[0]
                 .focus();
          }

          this.props.onEditModeChange( true );
          EventBus.emit( "showContextPanel"
                       , TopologyEditContext
                       , this.getTopologyContextProps()
                       );
        } else {
          this.props.onEditModeChange( false );
          EventBus.emit( "hideContextPanel", TopologyEditContext );
        }
      }

      if ( isEditing
        && _.xor( this.props.availableDisks
                , prevProps.availableDisks ).length
                ) {
        EventBus.emit( "updateContextPanel"
                     , TopologyEditContext
                     , this.getTopologyContextProps() );
      }
    }

  , componentWillUnmount () {
      EventBus.emit( "hideContextPanel", TopologyEditContext );
    }

  , getTopologyContextProps () {
      return (
        { availableDisks: this.props.availableDisks
        , handleReset: this.resetTopology
        }
      );
    }

  , handleEditModeChange ( isEditing ) {
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

  , vdevOperation( opType, key, purpose, options = {} ) {
      let collection  = this.state[ purpose ];
      let targetVdev  = collection[ key ];
      let currentType = null;
      let disks       = opType === "add" && options.path
                      ? [ options.path ]
                      : [];

      if ( collection ) {

        switch ( opType ) {
          case "add":
            currentType = collection.type;
            disks.push( ...ZfsUtil.getMemberDiskPaths( collection ) );
            break;

          case "remove":
            currentType = collection.type;
            disks.push(
              ..._.without( ZfsUtil.getMemberDiskPaths( collection )
                          , options.path
                          )
            );
            break;

          case "changeType":
            currentType = options.type;
            disks.push( ...ZfsUtil.getMemberDiskPaths( collection ) );
            break;
        }
      }

      this.setState(
        ZfsUtil.reconstructVdev( key
                               , purpose
                               , collection
                               , disks
                               , this.state.allowedTypes
                               , currentType
                               )
      );
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

  , handleVolumeNameChange ( event ) {
      this.setState({ name: event.target.value });
    }

  , resetTopology () {
      this.props.handleDiskClear();
      this.setState(
      { data: []
      , logs: []
      , cache: []
      , spares: []
      , free: 0
      , allowedTypes:
        { data: []
        , logs: []
        , cache: []
        , spares: []
        }
      }
      );
    }

  , submitVolume () {
      let { logs, cache, data, spares } = this.state;


      let newVolume =
        { topology:
          { logs: ZfsUtil.unwrapStripe( logs ) || this.props.logs
          , cache: ZfsUtil.unwrapStripe( cache ) || this.props.cache
          , data: ZfsUtil.unwrapStripe( data ) || this.props.data
          , spares: ZfsUtil.unwrapStripe( spares ) || this.props.spares
          }
        , type: "zfs"
        , name: this.state.name || this.props.name || "Volume"
        };

      ZM.submitVolume( newVolume );
      this.handleEditModeChange( false );
    }

  , createVolumeName () {
      let name = this.state.name || this.props.name;

      if ( this.state.editing ) {
        return (
          <div className="volume-name-input">
            <TWBS.Input
              ref = "volumeNameInput"
              type = "text"
              placeholder = "Volume Name"
              onChange = { this.handleVolumeNameChange }
              className = "form-overlay"
              value = { name }
            />
          </div>
        );
      } else {
        return (
          <h3 className="pull-left volume-name">{ name }</h3>
        );
      }
    }

  , createDrawerContent () {
      switch ( this.state.activeSection ) {
        case "disks":
          return (
            <PoolTopology
              availableDisks = { this.props.availableDisks }
              availableSSDs = { this.props.availableSSDs }
              data = { this.state.data }
              logs = { this.state.logs }
              cache = { this.state.cache }
              spares = { this.state.spares }
              allowedTypes = { this.state.allowedTypes }
              handleDiskAdd = { this.handleDiskAdd }
              handleDiskRemove = { this.handleDiskRemove }
              handleVdevRemove = { this.handleVdevRemove }
              handleVdevTypeChange = { this.handleVdevTypeChange }
              editing = { this.state.editing }
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

      let initMessage    = null;
      let volumeInfo     = null;
      let drawer         = null;
      let changesToolbar = null;

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
        let sectionNav = null;
        let breakdown = ZfsUtil.caluclateBreakdown( this.state.data );
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
          <div className="volume-info">
            <div className="clearfix">
              { this.createVolumeName() }
              <h3 className="pull-right volume-capacity">
                { ByteCalc.humanize( usable ) }
              </h3>
            </div>
            <BreakdownChart
              total  = { totalSize }
              parity = { parity }
              used   = { allocated }
              free   = { freeSize }
            />
          </div>
        );

        if ( this.props.existsOnRemote ) {
          // FIXME: Temporary measure to keep navigation from showing when first
          // creating a pool
          sectionNav = (
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
          );
        }

        drawer = (
          <div
            ref = "drawer"
            style = {{ display: "none" }}
            className = "volume-drawer"
          >
            { sectionNav }
            { this.createDrawerContent() }
          </div>
        );

        changesToolbar = (
          <div
            ref = "changesToolbar"
            style = {{ display: "none" }}
            className = "volume-info clearfix"
          >
            <TWBS.ButtonToolbar className="pull-right">
              <TWBS.Button bsStyle="default">
                { "Cancel" }
              </TWBS.Button>
              <TWBS.Button
                bsStyle = "primary"
                disabled = { !this.state.editing }
                onClick = { this.submitVolume }
              >
                { "Submit" }
              </TWBS.Button>
            </TWBS.ButtonToolbar>
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
          { drawer }
          { changesToolbar }
        </TWBS.Panel>
      );
    }

  }
);

export default Volume;
