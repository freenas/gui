// Hardware Information
// ====================
// Displays information about system hardware

"use strict";

import React from "react";
import TWBS from "react-bootstrap"

import routerShim from "../mixins/routerShim";

import SM from "../../flux/middleware/SystemMiddleware";
import SS from "../../flux/stores/SystemStore";

import ByteCalc from "../../utility/ByteCalc";


function getSystemInformation () {
  return { systemInformation: SS.getSystemInfo( "hardware" ) };
}

const Hardware = React.createClass({

  displayName: "Hardware"

  , mixins: [ routerShim ]

  , getInitialState: function () {
    return getSystemInformation();
  }

  , componentDidMount: function () {
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
      <TWBS.Panel header = "System Information" >
        <TWBS.ListGroup fill>
          <TWBS.ListGroupItem>{ "CPU: " + cpuModel }</TWBS.ListGroupItem>
          <TWBS.ListGroupItem>{ "CPU Cores: " + cpuCores }</TWBS.ListGroupItem>
          <TWBS.ListGroupItem>{ "Memory: " + ByteCalc.toBytes( memorySize ) }</TWBS.ListGroupItem>
        </TWBS.ListGroup>
      </TWBS.Panel>
    );
  }

});


export default Hardware;
