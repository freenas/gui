// Hardware Information
// ====================
// Displays information about system hardware

"use strict";

import React from "react";
import TWBS from "react-bootstrap";
import _ from "lodash";

import routerShim from "../mixins/routerShim";

import SM from "../../flux/middleware/SystemMiddleware";
import SS from "../../flux/stores/SystemStore";

import DM from "../../flux/middleware/DisksMiddleware";
import DS from "../../flux/stores/DisksStore"

import ByteCalc from "../../utility/ByteCalc";

import DiscTri from "../components/DiscTri";

import Disk from "../components/items/Disk";


function getSystemInformation () {
  return { systemInformation: SS.getSystemInfo( "hardware" ) };
}

function getDiskGroups () {
  return { diskGroups: DS.similarDisks };
}

const DiskDisclosure = React.createClass(
  { propTypes: { diskGroups: React.PropTypes.array.isRequired }

  , createDiskGroup: function ( group, groupName, groups ) {

    var diskItems = _.map( group
                         , function createDiskItems ( disk, index ) {
                           return (
                             <TWBS.Panel className = "disk-item"
                                         key = { index } >
                               <Disk path = { disk } />
                             </TWBS.Panel>
                           );
                         }
                         );

    return (
      <div className = "disk-category"
           key = { groupName }>
        <span className = "disk-category-title">{ groupName }</span>
        <TWBS.Well className = "disk-item-section"
                   bsSize = "small" >
          { diskItems }
        </TWBS.Well>
      </div>
    );
  }

  , render: function () {

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
               style = { { "overflow-y": "auto" } }>
        { diskGroups }
      </DiscTri>
    );
  }
  }
);

const Hardware = React.createClass({

  displayName: "Hardware"

  , mixins: [ routerShim ]

  , getInitialState: function () {
    return _.merge( getSystemInformation()
                  , getDiskGroups()
                  );
  }

  , componentDidMount: function () {
    DS.addChangeListener( this.handleDisksChange )
    DM.requestDisksOverview();
    DM.subscribe( this.constructor.displayName );

    SS.addChangeListener( this.handleHardwareChange );
    SM.requestSystemInfo( "hardware" );
    SM.subscribe( this.constructor.displayName );
  }

  , componentWillUnmount: function () {
    DS.removeChangeListener( this.handleDisksChange );
    DM.unsubscribe( this.constructor.displayName );

    SS.removeChangeListener( this.handleHardwareChange );
    SM.unsubscribe( this.constructor.displayName );
  }

  , handleDisksChange: function () {
    this.setState( getDiskGroups() );
  }

  , handleHardwareChange: function () {
    this.setState( getSystemInformation() );
  }

  , render: function () {

    let cpuModel = this.state.systemInformation
                 ? this.state.systemInformation[ "cpu_model" ]
                 : null;

    let cpuCores = this.state.systemInformation
                 ? this.state.systemInformation[ "cpu_cores" ]
                 : null;

    let memorySize = this.state.systemInformation
                   ? this.state.systemInformation[ "memory_size" ]
                   : null;

    return (
      <div className = { "hardware-display" }>
        <div className ={ "statics" }>
          <TWBS.Panel header = "System Information" /*TODO: split panel out into its own component when appropriate*/ >
            <TWBS.ListGroup fill>
              <TWBS.ListGroupItem>
                { "CPU: " + cpuModel }
              </TWBS.ListGroupItem>
              <TWBS.ListGroupItem>
                { "CPU Cores: " + cpuCores }
              </TWBS.ListGroupItem>
              <TWBS.ListGroupItem>
                { "Memory: " + ByteCalc.humanize( memorySize ) }
              </TWBS.ListGroupItem>
            </TWBS.ListGroup>
          </TWBS.Panel>
        </div>
        <div className = { "disclosures" } >
          <DiskDisclosure diskGroups = { this.state.diskGroups } />
        </div>
      </div>
    );
  }

});


export default Hardware;
