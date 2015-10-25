// Contextual Disks Display
// ========================
// A contextual popout for use with the ContextBar component. Displays icons
// for all disks that are not part of a volume so that they may be used for
// new vdev creation.

"use strict";

import React from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { Alert, Button, DropdownButton, MenuItem, Well } from "react-bootstrap";

// ACTIONS
import * as DISKS from "../../../actions/disks";
import * as VOLUMES from "../../../actions/volumes";
import * as SUBSCRIPTIONS from "../../../actions/subscriptions";

// UTILITY
import DiskUtilities from "../../../utility/DiskUtilities";

// COMPONENTS
import Disclosure from "../../../components/Disclosure";
import DragTarget from "../../../components/DragTarget";
import DropTarget from "../../../components/DropTarget";
import Disk from "../../../components/items/Disk";
import Topologizer from "../common/Topologizer";

const TERMS =
  { HDDS: "Disks"
  , SSDS: "SSDs"
  };

const PRESET_NAMES =
  [ "None"
  , "Optimal"
  , "Virtualization"
  , "Backups"
  , "Media"
  ];

const PRESET_VALUES =
  { "Optimal":
      { desired: [ "raidz1", "mirror" ]
      , highest: 1
      , priority: "storage"
      }
  , "Virtualization":
      { desired: [ "mirror" ]
      , highest: 1
      , priority: "speed"
      }
  , "Backups":
      { desired: [ "raidz2", "raidz1", "mirror" ]
      , highest: 1
      , priority: "safety"
      }
  , "Media":
      { desired: [ "raidz1", "mirror" ]
      , highest: 1
      , priority: "speed"
      }
  };

const PRESET_DESCS =
  { "None":
      ( "Select a ZFS topology layout to automatically assign drives to your, "
      + "pool, or use the topologizer tool to customize your layout."
      )
  ,"Optimal":
      ( "The Optimal preset will try to strike a good balance between speed, "
      + "storage, and safety."
      )
  , "Virtualization":
      ( "Virtualization prioritizes fast storage over capacity or parity. This "
      + "layout is similar to RAID 10 on a non-ZFS system."
      )
  , "Backups":
      ( "Backups emphasizes data security, and uses RAID Z2 to create extra "
      + "parity. For those willing to sacrifice performance for security, RAID "
      + "Z3 offers more redundancy with degraded speed."
      )
  , "Media":
      ( "Media attempts to create a highly performant pool with good parity. "
      + "It is similar to the Optimal preset, but has a greater emphasis on "
      + "speed over storage capacity."
      )
  };

class ContextDisks extends React.Component {
  constructor ( props ) {
    super( props );

    this.displayName = "Pool Topology Context Drawer";
  }

  onUpdateTopology ( preferences ) {
    this.props.onUpdateTopology( this.props.activeVolume, preferences )
  }

  handlePresetChange ( event, preset ) {
    if ( preset !== "None" ) {
      this.onUpdateTopology( PRESET_VALUES[ preset ] );
    }
  }

  ensureHomogeneity ( allowedType, path ) {
    // If this function returns `true`, dropping will be prevented. The test
    // uses the known type to check if the payload belongs to another group.

    switch ( allowedType.toUpperCase() ) {
      case "ssds":
        return this.props.disks[ path ] && !this.props.disks[ path ].status.is_ssd;

      case "hdds":
        return this.props.disks[ path ] && this.props.disks[ path ].status.is_ssd;

      default:
        return false;
    }
  }

  createPaletteSection ( type, disks, key ) {
    let available;

    switch ( type.toUpperCase() ) {
      case "SSDS":
        available = _.chain( disks )
                     .difference( this.state.selectedSSDs )
                     .intersection( this.state.availableSSDs )
                     .value();
        break;

      case "HDDS":
        available = _.chain( disks )
                     .difference( this.state.selectedHDDs )
                     .intersection( this.state.availableHDDs )
                     .value();
        break;
    }

    let headerText = key + " (" + available.length + ")";

    return (
      <Disclosure
        headerShow = { headerText }
        headerHide = { headerText }
        defaultExpanded = { available.length < 10 }
        key = { key }
      >
        <span className="disk-container">
          { available.map( ( path, index ) =>
            <div
              key = { index }
              className = "disk-wrapper"
            >
              <DragTarget
                namespace = "disk"
                payload = { path }
              >
                <Disk path={ path } />
              </DragTarget>
            </div>
          )}
        </span>
      </Disclosure>
    );
  }

  createPresetMenuItems () {
    return PRESET_NAMES.map( ( preset, index ) => {
      return (
        <MenuItem
          key = { index }
          eventKey = { preset }
          active = { preset === this.props.preset }
          onSelect = { this.handlePresetChange }
        >
          { preset }
        </MenuItem>
      );
    });
  }

  createDiskPalette ( collection, type ) {
    if ( _.isEmpty( collection ) ) {
      return null;
    } else {
      let paletteSection = _.map( collection
                                , this.createPaletteSection.bind( null, type )
                                );

      if ( paletteSection.length > 0 && paletteSection[0] ) {
        return (
          <div>
            <h5 className="context-section-header type-line">
              <span className="text">
                { "Available " + TERMS[ type.toUpperCase() ] }
              </span>
            </h5>
            <DropTarget
              namespace = "disk"
              preventDrop = { this.ensureHomogeneity.bind( null, type ) }
              activeDrop
            >
              <Well bsSize="small">
                { paletteSection }
              </Well>
            </DropTarget>
          </div>
        );
      } else {
        return null;
      }
    }
  }

  render () {
    return (
      <div className="context-content context-disks">

        <h5 className="context-section-header type-line">
          <span className="text">
            { "Modify Pool Topology" }
          </span>
        </h5>

        {/* TOPOLOGY TOOL */}
        <Topologizer handleTopoRequest = { this.onUpdateTopology } />

        {/* RESET BUTTON */}
        <Button
          block
          bsStyle = "default"
          onClick = { this.props.onRevertTopology }
        >
          {"Reset Pool Topology"}
        </Button>

        {/* PRESET SELECTOR */}
        <h5 className="context-section-header type-line">
          <span className="text">
            { "Preset Configuration" }
          </span>
        </h5>
        <DropdownButton
          block
          vertical
          id = "pool-topology-presets-dropdown"
          title = { this.props.preset }
          bsStyle = "primary"
        >
          { this.createPresetMenuItems() }
        </DropdownButton>
        <Alert
          bsStyle = "default"
        >
          { PRESET_DESCS[ this.props.preset ] }
        </Alert>

        {/* AVAILABLE DEVICES */}
      </div>
    );
  }
}

ContextDisks.propTypes =
  { subscribe: React.PropTypes.func.isRequired
  , unsubscribe: React.PropTypes.func.isRequired
  };

// REDUX
function mapStateToProps ( state ) {
  const { disks } = state;

  const SIMILAR = DiskUtilities.similarDisks( disks.disks );

  return (
    { disks: disks.disks
    , groupedSSDs: SIMILAR[0]
    , groupedHDDs: SIMILAR[1]
    , preset: "None"
    }
  );
}

const SUB_MASKS = [ "entity-subscriber.disks.changed" ];

function mapDispatchToProps ( dispatch ) {
  return (
    // SUBSCRIPTIONS
    { subscribe: ( id ) => dispatch( SUBSCRIPTIONS.add( SUB_MASKS, id ) )
    , unsubscribe: ( id ) => dispatch( SUBSCRIPTIONS.remove( SUB_MASKS, id ) )

    , fetchAvailableDisks: () => dispatch( VOLUMES.fetchAvailableDisks() )
    , onDiskSelect: () => console.log( "fart" )
    , onDiskDeselect: () => console.log( "fart" )

    , onUpdateVolume: ( volumeID, patch ) =>
      dispatch( VOLUMES.updateVolume( volumeID, patch ) )
    , onUpdateTopology: ( volumeID, preferences ) =>
      dispatch( VOLUMES.updateTopology( volumeID, preferences ) )
    , onRevertTopology: ( volumeID ) =>
      dispatch( VOLUMES.revertTopology( volumeID ) )
    }
  );
}

export default connect( mapStateToProps, mapDispatchToProps )( ContextDisks );
