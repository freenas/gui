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

import NewVolume from "./headers/NewVolume";
import ExistingVolume from "./headers/ExistingVolume";
import VolumeSections from "./VolumeSections";

import TopologyEditContext from "./contexts/TopologyEditContext";

const SECTIONS = [ "files", "filesystem", "snapshots", "topology" ];

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
    { becomeActive: React.PropTypes.func.isRequired
    , becomeInactive: React.PropTypes.func.isRequired
    , active: React.PropTypes.bool.isRequired
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

  , componentDidUpdate ( prevProps, prevState ) {
      let topologyContextProps =
        { handleReset: this.resetTopology
        , handleTopoRequest: this.handleTopoRequest
        };

      if ( prevProps.active !== this.props.active ) {
        if ( this.props.existsOnRemote ) {
          EventBus.emit( "hideContextPanel", TopologyEditContext );
        } else {
          EventBus.emit( "showContextPanel"
                       , TopologyEditContext
                       , topologyContextProps
                       );
        }
      }
    }

  , componentWillUnmount () {
      EventBus.emit( "hideContextPanel", TopologyEditContext );
    }


  // DRAWER MANAGEMENT
  // =================
  // Helper methods to mange the state of the Volume's drawer, including
  // communicating its active status to Storage.
  , handleDrawerOpen ( event ) {
      this.setState(
        { activeSection: this.state.activeSection || null
        }
        , this.props.becomeActive.bind( null, this.props.volumeKey )
      );
    }

  , closeDrawer () {
      this.props.becomeInactive();
    }

  , handleDrawerChange ( keyName ) {
      this.setState({ activeSection: keyName });
    }

  , getActiveSection ( allowedSections ) {
      if ( allowedSections.has( this.state.activeSection ) ) {
        // If the requested section is allowed, use it
        return this.state.activeSection;
      } else {
        // If the requested section was not allowed, iterate over all sections in
        // order, and make active whichever one is first found to be allowed
        SECTIONS.forEach( ( section ) => {
          if ( allowedSections.has( section ) ) {
            return section;
          }
        });

        // If no sections were allowed, use the last one in the line, which should
        // theoretically be the most fundamental
        return SECTIONS[ SECTIONS.length - 1 ];
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
        ZfsUtil.reconstructVdev( key, purpose, collection, disks, currentType )
      );
    }

  , handleDiskAdd ( vdevKey, vdevPurpose, path ) {
      ZAC.selectDisks( path );
      this.vdevOperation( "add", vdevKey, vdevPurpose, { path: path } );
    }

  , handleDiskRemove ( vdevKey, vdevPurpose, path, event ) {
      ZAC.deselectDisks( path );
      this.vdevOperation( "remove", vdevKey, vdevPurpose, { path: path } );
    }

  , handleVdevNuke ( vdevKey, vdevPurpose, event ) {
      this.vdevOperation( "nuke", vdevKey, vdevPurpose );
    }

  , handleVdevTypeChange ( vdevKey, vdevPurpose, vdevType, event ) {
      this.vdevOperation( "changeType", vdevKey, vdevPurpose, { type: vdevType } );
    }

  , resetTopology () {
      ZAC.replaceDiskSelection( [] );
      this.setState(
        { data   : []
        , log    : []
        , cache  : []
        , spares : []
        , free   : 0
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

  , render () {
      let volumeHeader = null;
      let editing;
      let data, log, cache, spares;
      let allowedSections;
      let panelClass   = [ "volume" ];

      if ( this.props.existsOnRemote ) {
        allowedSections = new Set(["filesystem", "topology"]);
        editing = false;
        ( { data, log, cache, spares } = this.props );
        const rootDataset =
          _.find( this.props.datasets, { name: this.props.name }).properties;

        const breakdown =
          { used   : ByteCalc.convertString( rootDataset.used.rawvalue )
          , avail  : ByteCalc.convertString( rootDataset.available.rawvalue )
          , parity : ZfsUtil.calculateBreakdown( this.props.data ).parity
        }

        volumeHeader = (
          <ExistingVolume
            volumeName        = { this.props.name }
            onDestroyPool     = { this.confirmPoolDestruction }
            onClick           = { this.handleDrawerOpen }
            topologyBreakdown = { breakdown }
          />
        );
      } else if ( this.props.active ) {
        allowedSections = new Set(["topology"]);
        editing = true;
        ( { data, log, cache, spares } = this.state );
        panelClass.push( "editing" );

        volumeHeader = (
          <NewVolume
            onVolumeNameChange = { this.handleVolumeNameChange }
            onSubmitClick      = { this.submitVolume }
            onCancelClick      = { this.closeDrawer }
            volumeName         = { this.state.name }
            topologyBreakdown =
              { ZfsUtil.calculateBreakdown( this.state.data ) }
          />
        );
      } else {
        // We can deduce that this Volume is the "blank" one, and that it has
        // not yet been interacted with. We use this state information to
        // display an initialization message.

        allowedSections = new Set();
        editing = false;
        ( { data, log, cache, spares } = this.state );
        panelClass.push( "awaiting-init", "text-center" );

        volumeHeader = (
          <Button
            bsStyle = "primary"
            onClick = { this.handleDrawerOpen }
          >
            { "Create new storage pool" }
          </Button>
        );
      }

      if ( this.props.active ) {
        panelClass.push( "active" );
      }

      return (
        <Panel
          className = { panelClass.join( " " ) }
        >
          { volumeHeader }

          {/* VOLUME SUB-SECTIONS */}
          <VolumeSections
            activeSection    = { this.getActiveSection( allowedSections ) }
            allowedSections  = { allowedSections }
            data             = { data }
            log              = { log }
            cache            = { cache }
            spares           = { spares }
            editing          = { editing }
            active           = { this.props.active }
            onSelect         = { this.handleDrawerChange }
            onDiskAdd        = { this.handleDiskAdd }
            onDiskRemove     = { this.handleDiskRemove }
            onVdevNuke       = { this.handleVdevNuke }
            onVdevTypeChange = { this.handleVdevTypeChange }
          />

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
              <Button onClick={ this.hideDestroyPoolModal }>
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
