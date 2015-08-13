// Contextual Disks Display
// ========================
// A contextual popout for use with the ContextBar component. Displays icons
// for all disks that are not part of a volume so that they may be used for
// new vdev creation.

"use strict";

import React from "react";
import _ from "lodash";
import TWBS from "react-bootstrap";

import DS from "../../../../../flux/stores/DisksStore";

import DiscTri from "../../../../components/DiscTri";
import DragTarget from "../../../../components/DragTarget";
import Disk from "../../../../components/items/Disk";

const ContextDisks = React.createClass(
  { displayName: "Pool Topology Context Drawer"

  , propTypes:
    { availableDisks: React.PropTypes.array.isRequired
    , handleReset: React.PropTypes.func.isRequired
    }

  , createPaletteSection ( disks, key ) {
      let available = _.intersection( disks, this.props.availableDisks );

      if ( available.length && available[0] ) {
        let headerText = key + " (" + available.length + ")";

        return (
          <DiscTri
            headerShow = { headerText }
            headerHide = { headerText }
            defaultExpanded = { available.length < 10 }
            key = { key }
          >
            <div className="disk-container">
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
            </div>
          </DiscTri>
        );
      } else {
        return null;
      }
    }

  , createDiskPalette ( collection, type ) {
      if ( _.isEmpty( collection ) ) {
        return null;
      } else {
        let paletteSection = _.map( collection, this.createPaletteSection );

        if ( paletteSection.length > 0 && paletteSection[0] ) {
          return (
            <div>
              <h5 className="context-section-header">
                <span className="type-line">{ "Available " + type }</span>
              </h5>
              <TWBS.Well bsSize="small">
                { paletteSection }
              </TWBS.Well>
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
        <div className="context-disks">
          { this.createDiskPalette( groupedDisks[0], "SSDs" ) }
          { this.createDiskPalette( groupedDisks[1], "Disks" ) }
          <TWBS.Button
            block
            bsStyle = "default"
            onClick = { this.props.handleReset }
          >
            {"Reset Pool Topology"}
          </TWBS.Button>
        </div>
      );
    }

  }
);

export default ContextDisks;
