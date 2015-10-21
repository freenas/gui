// DISK SECTION
// ============

"use strict";

import _ from "lodash";
import React from "react";
import { Well, Panel } from "react-bootstrap";

import Disclosure from "../../components/Disclosure";
import Disk from "../../components/items/Disk";

const DiskSection = ( props ) => {
  // diskGroups comes back as two objects: one for SSDs and one for HDDs.
  // Combine them into one array for display.
  const GROUPS = Object.assign( {}, props.diskGroups[0], props.diskGroups[1] );

  return (
    <Disclosure
      defaultExpanded
      headerShow = { "Disk Information" }
      headerHide = { "Disk Information" }
    >
      { Object.keys( GROUPS ).map( ( name, index ) =>
        <div key={ index } className="disk-category">
          <span className = "disk-category-title">{ name }</span>
          <Well className="disk-item-section" bsSize="small">
            { GROUPS[ name ].map( ( path, index ) =>
              <Panel key={ index } className="disk-item">
                <Disk disk={ props.disks[ path ] } />
             </Panel>
            ) }
          </Well>
        </div>
      )}
    </Disclosure>
  );
}

DiskSection.propTypes =
  { diskGroups: React.PropTypes.array.isRequired
  , disks: React.PropTypes.object.isRequired
  }

export default DiskSection;
