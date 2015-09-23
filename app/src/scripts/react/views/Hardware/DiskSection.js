// DISK SECTION
// ============

"use strict";

import _ from "lodash";
import React from "react";
import { Well, Panel } from "react-bootstrap";

import DiscTri from "../../components/DiscTri";
import Disk from "../../components/items/Disk";

const DiskSection = React.createClass(
  { propTypes: { diskGroups: React.PropTypes.array.isRequired }

  , createDiskGroup ( group, groupName, groups ) {

    var diskItems = _.map( group
                         , function createDiskItems ( disk, index ) {
                           return (
                             <Panel className = "disk-item"
                                         key = { index } >
                               <Disk path = { disk } />
                             </Panel>
                           );
                         }
                         );

    return (
      <div className = "disk-category"
           key = { groupName }>
        <span className = "disk-category-title">{ groupName }</span>
        <Well className = "disk-item-section"
                   bsSize = "small" >
          { diskItems }
        </Well>
      </div>
    );
  }

  , render () {
      // diskGroups comes back as two objects: one for SSDs and one for HDDs.
      // combine them into one array for display.
      var diskTypes = _.cloneDeep( this.props.diskGroups[0]);
      _.merge( diskTypes, this.props.diskGroups[1] );

      var diskGroups = _.map( diskTypes
                            , this.createDiskGroup
                            );

      return (
        <DiscTri headerShow = { "Disk Information" }
                 headerHide = { "Disk Information" }
                 defaultExpanded = { true }
                 style = { { "overflowY": "auto" } }>
          { diskGroups }
        </DiscTri>
      );
    }

  }
);

export default DiskSection;
