// Contextual Disks Display
// ========================
// A contextual popout for use with the ContextBar component. Displays icons
// for all disks that are not part of a volume so that they may be used for
// new vdev creation.

"use strict";

import React from "react";
import _ from "lodash";
import { Alert, Button, DropdownButton, MenuItem, Well } from "react-bootstrap";

import VS from "../../../../../flux/stores/VolumeStore";
import DS from "../../../../../flux/stores/DisksStore";

import DiscTri from "../../../../components/DiscTri";
import DragTarget from "../../../../components/DragTarget";
import DropTarget from "../../../../components/DropTarget";
import Disk from "../../../../components/items/Disk";
import Topologizer from "../Topologizer";

const TERMS =
  { hdds: "Disks"
  , ssds: "SSDs"
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

const ContextDisks = React.createClass(
  { displayName: "Pool Topology Context Drawer"

  , propTypes:
    { handleReset: React.PropTypes.func.isRequired
    , handleTopoRequest: React.PropTypes.func.isRequired
    }

  , getInitialState () {
    let newState = this.getUpdatedDiskInfo();

    newState.preset = "None";

    return newState;
  }

  , componentDidMount () {
      VS.addChangeListener( this.handleUpdatedVS );
    }

  , getUpdatedDiskInfo () {
      return { availableSSDs: VS.availableSSDs
             , selectedSSDs: VS.selectedSSDs
             , availableHDDs: VS.availableHDDs
             , selectedHDDs: VS.selectedHDDs
             };
    }

  , handleUpdatedVS () {
      this.setState( this.getUpdatedDiskInfo() );
    }

  , handlePresetChange ( event, preset ) {
      if ( preset === "None" ) {
        // TODO: We might want to re-enable this later
        // this.props.handleReset();
      } else {
        this.props.handleTopoRequest( PRESET_VALUES[ preset ] );
      }
      this.setState({ preset });
    }

  , ensureHomogeneity ( allowedType, payload ) {
      // If this function returns `true`, dropping will be prevented. The test
      // uses the known type to check if the payload belongs to another group.

      switch ( allowedType.toLowerCase() ) {
        case "ssds":
          return DS.isHDD( payload );

        case "hdds":
          return DS.isSSD( payload );

        default:
          return false;
      }
    }

  , createPaletteSection ( type, disks, key ) {
      let available;

      switch ( type.toLowerCase() ) {
        case "ssds":
          available = _.chain( disks )
                       .difference( this.state.selectedSSDs )
                       .intersection( this.state.availableSSDs )
                       .value();
          break;

        case "hdds":
          available = _.chain( disks )
                       .difference( this.state.selectedHDDs )
                       .intersection( this.state.availableHDDs )
                       .value();
          break;
      }

      let headerText = key + " (" + available.length + ")";

      return (
        <DiscTri
          headerShow = { headerText }
          headerHide = { headerText }
          defaultExpanded = { available.length < 10 }
          key = { key }
        >
          <span className="disk-container">
            { available.map( ( path, index ) => (
                  <div
                    className = "disk-wrapper"
                    key = { index }
                  >
                    <DragTarget
                      namespace = "disk"
                      payload = { path }
                    >
                      <Disk path={ path } />
                    </DragTarget>
                  </div>
                )
              )
            }
          </span>
        </DiscTri>
      );
    }

  , createPresetMenuItems ( ) {
      return PRESET_NAMES.map( preset => {
        return (
          <MenuItem
            onSelect = { this.handlePresetChange }
            eventKey = { preset }
            active = { preset === this.state.preset }
          >
            { preset }
          </MenuItem>
        );
      });
    }

  , createDiskPalette ( collection, type ) {
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
                  { "Available " + TERMS[ type.toLowerCase() ] }
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

  , render () {
      let groupedDisks = DS.similarDisks;

      return (
        <div className="context-content context-disks">

          <h5 className="context-section-header type-line">
            <span className="text">
              { "Modify Pool Topology" }
            </span>
          </h5>

          {/* TOPOLOGY TOOL */}
          <Topologizer
            handleTopoRequest = { this.props.handleTopoRequest }
          />

          {/* RESET BUTTON */}
          <Button
            block
            bsStyle = "default"
            onClick = { this.props.handleReset }
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
            title = { this.state.preset }
            bsStyle = "primary"
          >
            { this.createPresetMenuItems() }
          </DropdownButton>
          <Alert
            bsStyle = "default"
          >
            { PRESET_DESCS[ this.state.preset ] }
          </Alert>

          {/* AVAILABLE DEVICES */}
          { this.createDiskPalette( groupedDisks[0], "SSDs" ) }
          { this.createDiskPalette( groupedDisks[1], "HDDs" ) }
        </div>
      );
    }

  }
);

export default ContextDisks;
