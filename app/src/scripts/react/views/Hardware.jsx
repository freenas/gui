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

const DiskDisclosure = React.createClass(
  { propTypes: { disks: React.PropTypes.array.isRequired }

  , render: function () {

    var i;
    var j;

    var diskItems = _.map( this.props.disks
                           , function createDiskItems ( disk, index ) {
                             return (
                               <TWBS.Col xs = { 3 }
                                         key = { index } >
                                 <TWBS.Panel>
                                   <Disk path = { disk.path } />
                                 </TWBS.Panel>
                                </TWBS.Col>
                             );
                           }
                           );

    return (
      <DiscTri headerShow = { "Disk Information" }
               headerHide = { "Disk Information" }
               defaultExpanded = { true }
               style = { { "overflow-y": "auto" } }>
        <TWBS.Grid fluid >
          <TWBS.Row>
            { diskItems }
          </TWBS.Row>
        </TWBS.Grid>
      </DiscTri>
    );
  }
  }
);

const Hardware = React.createClass({

  displayName: "Hardware"

  , mixins: [ routerShim ]

  , getInitialState: function () {
    return getSystemInformation();
  }

  , componentDidMount: function () {
    DM.requestDisksOverview();

    SS.addChangeListener( this.handleHardwareChange );
    SM.requestSystemInfo( "hardware" );
    SM.subscribe( this.constructor.displayName );
  }

  , componentWillUnmount: function () {
    SS.removeChangeListener( this.handleHardwareChange );
    SM.unsubscribe( this.constructor.displayName );
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
          <DiskDisclosure disks = { DS.disksArray } />
        </div>
      </div>
    );
  }

});


export default Hardware;
