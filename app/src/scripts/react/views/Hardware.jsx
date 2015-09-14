// Hardware Information
// ====================
// Displays information about system hardware

"use strict";

import React from "react";
import { Panel, Well, ListGroup, ListGroupItem } from "react-bootstrap";
import _ from "lodash";

import routerShim from "../mixins/routerShim";

import SM from "../../flux/middleware/SystemMiddleware";
import SS from "../../flux/stores/SystemStore";

import DM from "../../flux/middleware/DisksMiddleware";
import DS from "../../flux/stores/DisksStore";

import ByteCalc from "../../utility/ByteCalc";

import DiskSection from "./Hardware/DiskSection";

function getSystemInformation () {
  return { systemInformation: SS.getSystemInfo( "hardware" ) };
}

function getDiskGroups () {
  return { diskGroups: DS.similarDisks };
}

const Hardware = React.createClass({

  displayName: "Hardware"

  , mixins: [ routerShim ]

  , getInitialState () {
    return _.merge( getSystemInformation()
                  , getDiskGroups()
                  );
  }

  , componentDidMount () {
    DS.addChangeListener( this.handleDisksChange );
    DM.requestDisksOverview();
    DM.subscribe( this.constructor.displayName );

    SS.addChangeListener( this.handleHardwareChange );
    SM.requestSystemInfo( "hardware" );
    SM.subscribe( this.constructor.displayName );
  }

  , componentWillUnmount () {
    DS.removeChangeListener( this.handleDisksChange );
    DM.unsubscribe( this.constructor.displayName );

    SS.removeChangeListener( this.handleHardwareChange );
    SM.unsubscribe( this.constructor.displayName );
  }

  , handleDisksChange () {
    this.setState( getDiskGroups() );
  }

  , handleHardwareChange () {
    this.setState( getSystemInformation() );
  }

  , render () {

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
      <main className = { "hardware-wrapper" }>
        <div className ={ "statics" }>
          <Panel header = "System Information" /*TODO: split panel out into its own component when appropriate*/ >
            <ListGroup fill>
              <ListGroupItem>
                { "CPU: " + cpuModel }
              </ListGroupItem>
              <ListGroupItem>
                { "CPU Cores: " + cpuCores }
              </ListGroupItem>
              <ListGroupItem>
                { "Memory: " + ByteCalc.humanize( memorySize ) }
              </ListGroupItem>
            </ListGroup>
          </Panel>
        </div>
        <div className = { "disclosures" } >
          <DiskSection diskGroups = { this.state.diskGroups } />
        </div>
      </main>
    );
  }

});


export default Hardware;
