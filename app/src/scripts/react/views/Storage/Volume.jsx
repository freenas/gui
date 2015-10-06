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

const RAW_VALUE_PROPTYPE = {
  rawvalue:
    React.PropTypes.oneOfType(
      [ React.PropTypes.string
      , React.PropTypes.number
      ]
    ).isRequired
};

const Volume = React.createClass(
  { displayName: "Volume"

  , propTypes:
    { becomeActive: React.PropTypes.func.isRequired
    , becomeInactive: React.PropTypes.func.isRequired
    , active: React.PropTypes.bool.isRequired
    , existsOnRemote: React.PropTypes.bool
    , name: React.PropTypes.string
    , diskData: React.PropTypes.shape(
        { availableSSDs: React.PropTypes.array.isRequired
        , availableHDDs: React.PropTypes.array.isRequired
        }
      )
    , topology: React.PropTypes.shape(
        { data  : React.PropTypes.array.isRequired
        , log   : React.PropTypes.array.isRequired
        , cache : React.PropTypes.array.isRequired
        , spare : React.PropTypes.array.isRequired
        }
      )
    , datasets: React.PropTypes.array
    , shares: React.PropTypes.instanceOf( Map )
    , properties: React.PropTypes.shape(
        { free      : React.PropTypes.shape( RAW_VALUE_PROPTYPE )
        , allocated : React.PropTypes.shape( RAW_VALUE_PROPTYPE )
        , size      : React.PropTypes.shape( RAW_VALUE_PROPTYPE )
        }
      )
    , filesystemHandlers: React.PropTypes.object.isRequired
  }


  // REACT COMPONENT MANAGEMENT LIFECYCLE
  // ====================================
  , getDefaultProps () {
      return { existsOnRemote : false
             };
    }

  , getInitialState () {
      return (
        { activeSection : null
        , name          : ""
        , topology:
          { data  : []
          , log   : []
          , cache : []
          , spare : []
          }
        , properties:
          { free      : { rawvalue: 0 }
          , allocated : { rawvalue: 0 }
          , size      : { rawvalue: 0 }
          }
        }
      );
    }

  , componentDidUpdate ( prevProps, prevState ) {
      const topologyContextProps =
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
      const CREATOR_OUTPUT =
        ZfsUtil.createTopology( this.props.diskData.availableSSDs
                              , this.props.diskData.availableHDDs
                              , preferences
                              );

      ZAC.replaceDiskSelection( CREATOR_OUTPUT[1] );
      this.setState({ topology: CREATOR_OUTPUT[0] });
    }

  , vdevOperation( opType, key, purpose, options = {} ) {
      let collection  = this.state.topology[ purpose ];
      let targetVdev  = collection[ key ];
      let currentType = null;
      let disks       = opType === "add" && options.path
                      ? [ options.path ]
                      : [];
      let newTopologySection;

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

      newTopologySection =
        ZfsUtil.reconstructVdev( key, purpose, collection, disks, currentType );

      this.setState(
        { topology: Object.assign( this.state.topology, newTopologySection )
        }
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
        { topology:
          { data  : []
          , log   : []
          , cache : []
          , spare : []
          }
        , properties:
          { free: { rawvalue: 0 }
          }
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
      let { log, cache, data, spare } = this.state.topology;

      let newVolume =
        { topology:
          { log: log
               ? ZfsUtil.unwrapStripe( log )
               : this.props.topology.log
          , cache: cache
                 ? ZfsUtil.unwrapStripe( cache )
                 : this.props.topology.cache
          , data: data
                ? ZfsUtil.unwrapStripe( data )
                : this.props.topology.data
          , spare: spare
                  ? ZfsUtil.unwrapStripe( spare )
                  : this.props.topology.spare
          }
        , type: "zfs"
        , name: this.state.name
              || this.props.name
              || "Volume" + ( this.props.volumeKey + 1 )
        };

      ZM.submitVolume( newVolume );
    }

  , destroyVolume () {
    if ( this.props.existsOnRemote ) {
      ZM.destroyVolume( this.props.name );
      this.setState({ showDestroyPoolModal: false });
    } else {
      throw new Error( "STORAGE: Somehow, the user tried to destroy a pool "
                     + "that doesn't exist on the server: "
                     + this.props.name
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
      let editing;
      let topology;
      let allowedSections;

      let volumeHeader = null;
      let panelClass   = [ "volume" ];

      const TOPOLOGY_HANDLERS =
        { onDiskAdd        : this.handleDiskAdd
        , onDiskRemove     : this.handleDiskRemove
        , onVdevNuke       : this.handleVdevNuke
        , onVdevTypeChange : this.handleVdevTypeChange
        };

      if ( this.props.existsOnRemote ) {
        editing         = false;
        topology        = this.props.topology;
        allowedSections = new Set(["filesystem", "topology"]);

        let breakdown;

        if ( this.props.datasets.length ) {
          let rootDataset = _.find( this.props.datasets
                                  , { name: this.props.name }
                                  ).properties;
          breakdown =
            { used   : ByteCalc.convertString( rootDataset.used.rawvalue )
            , avail  : ByteCalc.convertString( rootDataset.available.rawvalue )
            , parity : ZfsUtil.calculateBreakdown( topology.data ).parity
          }
        } else {
          breakdown = { used: 0, avail: 0, parity: 0 };
          console.warn( `The root dataset for ${ this.props.name } does not `
                      + `seem to exist`
                      );
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
        editing         = true;
        topology        = this.state.topology;
        allowedSections = new Set(["topology"]);

        volumeHeader = (
          <NewVolume
            onVolumeNameChange = { this.handleVolumeNameChange }
            onSubmitClick      = { this.submitVolume }
            onCancelClick      = { this.closeDrawer }
            volumeName         = { this.state.name }
            topologyBreakdown =
              { ZfsUtil.calculateBreakdown( topology.data ) }
          />
        );
        panelClass.push( "editing" );
      } else {
        // We can deduce that this Volume is the "blank" one, and that it has
        // not yet been interacted with. We use this state information to
        // display an initialization message.

        editing         = false;
        topology        = this.state.topology;
        allowedSections = new Set();

        volumeHeader = (
          <Button
            bsStyle = "primary"
            onClick = { this.handleDrawerOpen }
          >
            { "Create new storage pool" }
          </Button>
        );
        panelClass.push( "awaiting-init", "text-center" );
      }

      if ( this.props.active ) { panelClass.push( "active" ); }

      return (
        <Panel
          className = { panelClass.join( " " ) }
        >
          { volumeHeader }

          {/* VOLUME SUB-SECTIONS */}
          <VolumeSections
            { ...this.props }
            activeSection      = { this.getActiveSection( allowedSections ) }
            editing            = { editing }
            topology           = { topology }
            onSelect           = { this.handleDrawerChange }
            topologyHandlers   = { TOPOLOGY_HANDLERS }
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
