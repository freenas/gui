// ZFS POOL / VOLUME ITEM
// ======================
// Individual item which represents a ZFS pool and its associated volume.
// Contains the datasets, ZVOLs, and other high level objects that are
// properties of the pool.

"use strict";

import _ from "lodash";
import React from "react";
import { Button, ButtonToolbar, Input, Panel, Modal } from "react-bootstrap";

import ZAC from "../../../flux/actions/ZfsActionCreators";
import ZM from "../../../flux/middleware/ZfsMiddleware";
import VS from "../../../flux/stores/VolumeStore";

import EventBus from "../../../utility/EventBus";
import ByteCalc from "../../../utility/ByteCalc";

import ZfsUtil from "./utility/ZfsUtil";

import NewVolumeForm from "./Volumes/NewVolumeForm";
import ExistingVolumeHeader from "./Volumes/ExistingVolumeHeader";
import VolumeSectionNav from "./Volumes/VolumeSectionNav";
import BreakdownChart from "./Volumes/BreakdownChart";
import PoolDatasets from "./Volumes/PoolDatasets";
import PoolTopology from "./Volumes/PoolTopology";

import TopologyEditContext from "./Volumes/contexts/TopologyEditContext";

var Velocity;

if ( typeof window !== "undefined" ) {
  Velocity = require( "velocity-animate" );
} else {
  // mocked velocity library
  Velocity = function() {
    return Promise().resolve( true );
  };
}

const SLIDE_DURATION = 500;
const DRAWERS = [ "files", "snapshots", "filesystem", "disks" ];

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
    { requestActive: React.PropTypes.func.isRequired
    , existsOnRemote: React.PropTypes.bool
    , data: React.PropTypes.array
    , log: React.PropTypes.array
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


  // REACT COMPONENT MANAGEMENT LIFECYCLE
  // ====================================
  , getDefaultProps () {
      return { existsOnRemote : false
             };
    }

  , getInitialState () {
      return { activeSection : null
             , desiredSection: null
             , editing       : false
             , data          : []
             , log           : []
             , cache         : []
             , spares        : []
             , free          : 0
             , allocated     : 0
             , size          : 0
             , name          : ""
             };
    }

  , componentWillReceiveProps ( nextProps ) {
      if ( this.props.active !== nextProps.active ) {
        // Storage.jsx has authorized an active state on this component, or has
        // revoked it

        if ( nextProps.active ) {
          let allowedSections = this.getAllowedDrawers();
          let newState =
            { activeSection: _.contains( allowedSections
                                       , this.state.desiredSection
                                       )
                           ? this.state.desiredSection
                           : allowedSections[0]
            , desiredSection: null
            , editing: this.props.existsOnRemote
                     ? false
                     : true
            };

          this.setState( newState, this.slideDownDrawer );
        } else {
          let onComplete = () => {
            this.setState({ activeSection: null, editing: false });
          };

          this.slideUpDrawer( onComplete );
        }
      }
    }

  , componentDidUpdate ( prevProps, prevState ) {
      let topologyContextProps =
        { handleReset: this.resetTopology
        , handleTopoRequest: this.handleTopoRequest
        };

      if ( prevState.editing !== this.state.editing ) {
        if ( this.state.editing ) {
          EventBus.emit( "showContextPanel"
                       , TopologyEditContext
                       , topologyContextProps
                       );
        } else {
          EventBus.emit( "hideContextPanel", TopologyEditContext );
        }
      }
    }

  , componentWillUnmount () {
      EventBus.emit( "hideContextPanel", TopologyEditContext );
    }


  // ANIMATION HELPERS
  // =================
  , slideDownDrawer () {
      Velocity( React.findDOMNode( this.refs.drawer )
              , "slideDown"
              , { duration: SLIDE_DURATION
                }
              );
    }

  , slideUpDrawer ( onComplete ) {
      Velocity( React.findDOMNode( this.refs.drawer )
              , "slideUp"
              , { duration: SLIDE_DURATION
                , complete: onComplete
                }
              );
    }


  // DRAWER MANAGEMENT
  // =================
  // Helper methods to mange the state of the Volume's drawer, including
  // communicating its active status to Storage.
  , openDrawer ( desiredSection = null ) {
      this.setState(
        { desiredSection: desiredSection
        }
        , this.props.requestActive.bind( null, this.props.volumeKey )
      );
    }

  , closeDrawer () {
      this.props.requestActive( null );
    }

  , toggleDrawer ( event ) {
      if ( this.state.activeSection ) {
        this.closeDrawer();
      } else {
        this.openDrawer();
      }
    }

  , getAllowedDrawers () {
      // TODO: Needs more complex logic
      if ( this.props.existsOnRemote ) {
        return [ _.last( DRAWERS ) ];
      } else {
        return [ _.last( DRAWERS ) ];
      }
    }

  , handleDrawerChange ( keyName ) {
      if ( DRAWERS.has( keyName ) ) {
        this.setState({ activeSection: keyName });
      } else {
        this.setState({ activeSection: null });
      }
    }


  // ZFS TOPOLOGY FUNCTIONS
  // ======================
  , handleTopoRequest ( preferences ) {
      let creatorOutput =
        ZfsUtil.createTopology( VS.availableSSDs
                              , VS.availableHDDs
                              , preferences
                              );

      let topology = creatorOutput[0];
      let devicesUsed = creatorOutput[1];

      ZAC.replaceDiskSelection( devicesUsed );
      this.setState( topology );
    }

  , vdevOperation( opType, key, purpose, options = {} ) {
      let collection  = this.state[ purpose ];
      let targetVdev  = collection[ key ];
      let currentType = null;
      let disks       = opType === "add" && options.path
                      ? [ options.path ]
                      : [];

      if ( targetVdev ) {

        switch ( opType ) {
          case "add":
            currentType = targetVdev.type;
            disks.push( ...ZfsUtil.getMemberDiskPaths( targetVdev ) );
            break;

          case "remove":
            currentType = targetVdev.type;
            disks.push(
              ..._.without( ZfsUtil.getMemberDiskPaths( targetVdev )
                          , options.path
                          )
            );
            break;

          case "nuke":
            ZAC.deselectDisks( ZfsUtil.getMemberDiskPaths( targetVdev ) );
            break;

          case "changeType":
            currentType = options.type;
            disks.push( ...ZfsUtil.getMemberDiskPaths( targetVdev ) );
            break;
        }
      }

      this.setState(
        ZfsUtil.reconstructVdev( key
                               , purpose
                               , collection
                               , disks
                               , currentType
                               )
      );
    }

  , handleDiskAdd ( vdevKey, vdevPurpose, path ) {
      ZAC.selectDisks( path );
      this.vdevOperation( "add"
                        , vdevKey
                        , vdevPurpose
                        , { path: path }
                        );
    }

  , handleDiskRemove ( vdevKey, vdevPurpose, path, event ) {
      ZAC.deselectDisks( path );
      this.vdevOperation( "remove"
                        , vdevKey
                        , vdevPurpose
                        , { path: path }
                        );
    }

  , handleVdevNuke ( vdevKey, vdevPurpose, event ) {
      this.vdevOperation( "nuke"
                        , vdevKey
                        , vdevPurpose
                        );
    }

  , handleVdevTypeChange ( vdevKey, vdevPurpose, vdevType, event ) {
      this.vdevOperation( "changeType"
                        , vdevKey
                        , vdevPurpose
                        , { type: vdevType }
                        );
    }

  , resetTopology () {
      ZAC.replaceDiskSelection( [] );
      this.setState(
        { data: []
        , log: []
        , cache: []
        , spares: []
        , free: 0
        }
      );
    }


  // GENERAL HANDLERS
  // ================
  , handleVolumeNameChange ( event ) {
      this.setState({ name: event.target.value });
    }


  // MIDDLEWARE COMMUNICATION
  // ========================
  , submitVolume () {
      let { log, cache, data, spares, name } = this.state;

      let newVolume =
        { topology:
          { log: ZfsUtil.unwrapStripe( log ) || this.props.log
          , cache: ZfsUtil.unwrapStripe( cache ) || this.props.cache
          , data: ZfsUtil.unwrapStripe( data ) || this.props.data
          , spares: ZfsUtil.unwrapStripe( spares ) || this.props.spares
          }
        , type: "zfs"
        , name: name || this.props.name
              || "Volume" + ( this.props.volumeKey + 1 )
        };

      ZM.submitVolume( newVolume );
      this.setState(
        { editing: false
        }
      );
    }

  , destroyVolume () {
    if ( this.props.existsOnRemote ) {
      ZM.destroyVolume( this.props.name );
      this.setState({ showDestroyPoolModal: false });
    } else {
      throw new Error( "STORAGE: Somehow, the user tried to destroy a pool "
                     + "that doesn't yet exist on the server"
                     );
    }
  }


  // RENDER METHODS
  // ==============
  , confirmPoolDestruction () {
      this.setState({ showDestroyPoolModal: true });
    }

  , hideDestroyPoolModal () {
      this.setState({ showDestroyPoolModal: false });
    }

  , createDrawerContent () {
      switch ( this.state.activeSection ) {
        case "disks":
          // TODO: Temporary workaround until editing volumes works
          let { data, log, cache, spares } = this.props.existsOnRemote
                                            ? this.props
                                            : this.state;

          return (
            <PoolTopology
              data = { data }
              log = { log }
              cache = { cache }
              spares = { spares }
              handleDiskAdd = { this.handleDiskAdd }
              handleDiskRemove = { this.handleDiskRemove }
              handleVdevRemove = { this.handleVdevRemove }
              handleVdevNuke = { this.handleVdevNuke }
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
      const NOT_INITIALIZED = !this.props.existsOnRemote && !this.state.editing;

      let panelClass = [ "volume" ];
      if ( this.state.editing ) { panelClass.push( "editing" ); }

      let volumeHeader = null;
      let drawer       = null;

      if ( NOT_INITIALIZED ) {
        // We can deduce that this Volume is the "blank" one, and that it has
        // not yet been interacted with. We use this state information to
        // display an initialization message.

        panelClass.push( "awaiting-init", "text-center" );

        volumeHeader = (
          <Button
            bsStyle = "primary"
            onClick = { this.openDrawer.bind( this, "disks" ) }
          >
            { "Create new storage pool" }
          </Button>
        );
      } else {
        if ( this.state.editing ) {
          volumeHeader = (
            <NewVolumeForm
              onVolumeNameChange = { this.handleVolumeNameChange }
              onSubmitClick      = { this.submitVolume }
              onCancelClick      = { this.closeDrawer }
              volumeName         = { this.state.name }
              topologyBreakdown =
                { ZfsUtil.calculateBreakdown( this.state.data ) }
            />
          );
        } else {
          let rootDataset =
            _.find( this.props.datasets
                  , { name: this.props.name }
                  ).properties;

          let breakdown =
            { used   : ByteCalc.convertString( rootDataset.used.rawvalue )
            , avail  : ByteCalc.convertString( rootDataset.available.rawvalue )
            , parity : ZfsUtil.calculateBreakdown( this.props.data ).parity
          }

          volumeHeader = (
            <ExistingVolumeHeader
              volumeName        = { this.props.name }
              onDestroyPool     = { this.confirmPoolDestruction }
              topologyBreakdown = { breakdown }
            />
          );
        }

        drawer = (
          <div
            ref = "drawer"
            style = {{ display: "none" }}
            className = "volume-drawer"
          >
            { this.props.existsOnRemote
            ? <VolumeSectionNav
                activeKey = { this.state.activeSection }
                onSelect = { this.handleDrawerChange }
              />
            : null
            }
            { this.createDrawerContent() }
          </div>
        );
      }

      return (
        <Panel
          className = { panelClass.join( " " ) }
          onClick   = { this.toggleDrawer }
        >

          { volumeHeader }
          { drawer }

          {/* CONFIRMATION DIALOG - POOL DESTRUCTION */}
          <Modal
            show   = { this.state.showDestroyPoolModal }
            onHide = { this.hideDestroyPoolModal }
          >

            <Modal.Header closebutton>
              <Modal.Title>
                {"Confirm Destruction of " + this.props.name }
              </Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <p>
                { "Bro are you like, really really sure you want to do this? "
                + "Once you destroy "}<b>{ this.props.name }</b>{" it's not "
                + "coming back. (In other words, I hope you backed up your "
                + "porn.)"
                }
              </p>
            </Modal.Body>

            <Modal.Footer>
              <Button
                onClick = { this.hideDestroyPoolModal }
              >
                {"Uhhh no"}
              </Button>
              <Button
                bsStyle = { "danger" }
                onClick = { this.destroyVolume }
              >
                {"Blow my pool up fam"}
              </Button>
            </Modal.Footer>

          </Modal>
        </Panel>
      );
    }
  }
);

export default Volume;
