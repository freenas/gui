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

const PRESET_DESCS =
  { "None":
      ( "Either select a layout from the drop-down menu "
      + "or drag the circle to the corner of the colored triangle that matches the layout you wish to optimize."
      )
  ,"Optimal":
      ( "Strike a good balance between speed, "
      + "capacity, and redundancy."
      )
  , "Virtualization":
      ( "Prioritize speed over capacity or redundancy. This "
      + "layout is similar to RAID 10 on a non-ZFS system."
      )
  , "Backups":
      ( "Emphasize redundancy using RAID Z2 (requires a minimum of 4 disks)."
      )
  , "Media":
      ( "Emphasize performance with good parity. "
      + "It is similar to Optimal, but has a greater emphasis on "
      + "speed over storage capacity."
      )
  };

class ContextDisks extends React.Component {
  constructor ( props ) {
    super( props );

    this.displayName = "Pool Topology Context Drawer";
  }

  ensureHomogeneity ( allowedType, path ) {
    // If this function returns `true`, dropping will be prevented. The test
    // uses the known type to check if the payload belongs to another group.

    switch ( allowedType.toUpperCase() ) {
      case "SSDS":
        return this.props.HDDs.has( path );

      case "HDDS":
        return this.props.SSDs.has( path );

      default:
        return false;
    }
  }

  removeUsedDisks ( paths ) {
    let unusedDisks = [];

    paths.forEach( path => {
      // Filter out any disks which have been selected already
      if ( this.props.selectedDisks.has( path ) ) return;

      // Only show the disk if it's marked as available by the system
      if ( this.props.availableDisks.has( path ) ) {
        unusedDisks.push( path );
        return;
      }
    });

    return unusedDisks;
  }

  renderDiskGroup ( diskPaths, indexInCollection, groupName ) {
    let headerText = groupName + " (" + diskPaths.length + ")";

    return (
      <Disclosure
        header = { headerText }
        defaultExpanded = { diskPaths.length < 24 }
        key = { indexInCollection }
        style = { diskPaths.length ? {} : { display: "none" } }
      >
        <span className="disk-container">
          { diskPaths.map( ( path, index ) =>
            <div
              key = { index }
              className = "disk-wrapper"
            >
              <DragTarget
                namespace = "disk"
                payload = { path }
              >
                <Disk disk={ this.props.disks[ path ] } />
              </DragTarget>
            </div>
          )}
        </span>
      </Disclosure>
    );
  }

  renderDiskPalette ( collection, type ) {
    let renderableGroups = {};

    Object.keys( collection ).forEach( key => {
      let renderable = this.removeUsedDisks( collection[ key ] );
      if ( renderable.length ) {
        renderableGroups[ key ] = renderable
      }
    });

    const KEYS = Object.keys( renderableGroups );

    return (
      <div>
        <h5 className="context-section-header type-line">
          <span className="text">
            { "Available " + TERMS[ type.toUpperCase() ] }
          </span>
        </h5>
        <DropTarget
          namespace = "disk"
          preventDrop = { () => this.ensureHomogeneity( type ) }
          activeDrop
        >
          <Well bsSize="small">
            { KEYS.length === 0
            ? <div className="text-center text-muted">
                <em>{ `There are no available ${ type }` }</em>
              </div>
            : KEYS.map( ( key, index ) =>
              this.renderDiskGroup( renderableGroups[ key ], index, key )
            )}
          </Well>
        </DropTarget>
      </div>
    );
  }

  createPresetMenuItems () {
    return PRESET_NAMES.map( ( preset, index ) => {
      return (
        <MenuItem
          key = { index }
          eventKey = { preset }
          active = { preset === this.props.preset }
          onSelect = { ( event, preset ) =>
            this.props.onSelectPresetTopology( this.props.activeVolume, preset )
          }
        >
          { preset }
        </MenuItem>
      );
    });
  }

  render () {
    return (
      <div className="context-content context-disks">

        <h5 className="context-section-header type-line">
          <span className="text">
            { "Optimize Layout For:" }
          </span>
        </h5>

        {/* TOPOLOGY TOOL */}
        <Topologizer
          handleTopoRequest = { preferences =>
            this.props.onUpdateTopology( this.props.activeVolume, preferences )
          }
          />

        {/* RESET BUTTON */}
        <Button
          block
          bsStyle = "default"
          onClick = { () =>
            this.props.onRevertTopology( this.props.activeVolume )
          }
        >
          {"Reset Layout"}
        </Button>

        {/* PRESET SELECTOR */}
        <h5 className="context-section-header type-line">
          <span className="text">
            { "Or Select Layout:" }
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
        { this.renderDiskPalette( this.props.groupedSSDs, "SSDs" ) }
        { this.renderDiskPalette( this.props.groupedHDDs, "HDDs" ) }
      </div>
    );
  }
}

ContextDisks.propTypes =
  { subscribe: React.PropTypes.func.isRequired
  , unsubscribe: React.PropTypes.func.isRequired
  , availableDisks: React.PropTypes.instanceOf( Set ).isRequired
  , selectedDisks: React.PropTypes.instanceOf( Set ).isRequired
  , activeVolume: React.PropTypes.string.isRequired
  , preset: React.PropTypes.oneOf(
      [ "None"
      , "Optimal"
      , "Virtualization"
      , "Backups"
      , "Media"
      ]
    ).isRequired
  };


// REDUX
function mapStateToProps ( state ) {
  const { disks, volumes } = state;

  const SIMILAR = DiskUtilities.similarDisks( disks.disks );
  const ACTIVE = Object.assign( {}
                              , volumes.serverVolumes[ volumes.activeVolume ]
                              , volumes.clientVolumes[ volumes.activeVolume ]
                              );

  if ( Object.keys( ACTIVE ).length === 0 ) {
    console.warn( "TopologyEditContext has no volume associated with it" );
  }

  return (
    { disks: disks.disks
    , availableDisks: volumes.availableDisks
    , selectedDisks: ACTIVE.selectedDisks
    , activeVolume: volumes.activeVolume
    , preset: ACTIVE.preset
    , SSDs: state.disks.SSDs
    , HDDs: state.disks.HDDs
    , groupedSSDs: SIMILAR[0]
    , groupedHDDs: SIMILAR[1]
    }
  );
}

const SUB_MASKS = [ "entity-subscriber.disk.changed" ];

function mapDispatchToProps ( dispatch ) {
  return (
    // SUBSCRIPTIONS
    { subscribe: ( id ) => dispatch( SUBSCRIPTIONS.add( SUB_MASKS, id ) )
    , unsubscribe: ( id ) => dispatch( SUBSCRIPTIONS.remove( SUB_MASKS, id ) )

    , fetchAvailableDisks: () => dispatch( VOLUMES.fetchAvailableDisks() )
    , onDiskSelect: () => console.log( "fart" )
    , onDiskDeselect: () => console.log( "fart" )

    , onUpdateTopology: ( volumeID, preferences ) =>
      dispatch( VOLUMES.updateTopology( volumeID, preferences ) )
    , onRevertTopology: ( volumeID ) =>
      dispatch( VOLUMES.revertTopology( volumeID ) )

    , onSelectPresetTopology: ( volumeID, preset ) =>
      dispatch( VOLUMES.selectPresetTopology( volumeID, preset ) )
    }
  );
}

export default connect( mapStateToProps, mapDispatchToProps )( ContextDisks );
