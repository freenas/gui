// SYSTEM INFO WIDGET
// ==================

"use strict";

import _ from "lodash";
import React from "react";
import Throbber from "../Throbber";
import Widget from "../Widget";

import NM from "../../../flux/middleware/NetworkConfigMiddleware";
import NS from "../../../flux/stores/NetworkConfigStore";

import SM from "../../../flux/middleware/SystemMiddleware";
import SS from "../../../flux/stores/SystemStore";

import DM from "../../../flux/middleware/DisksMiddleware";
import DS from "../../../flux/stores/DisksStore";

import ByteCalc from "../../../utility/ByteCalc";


function getNetworkConfig () {
  return { networkConfig: NS.networkConfig };
}

function getSystemInformation () {
  return { systemInformation:
           _.merge( SS.getSystemInfo( "hardware" )
                  , SS.systemGeneralConfig
                  )
         };
}

function getPredominantDisks () {
  let predominantDisks = DS.predominantDisks;

  return { predominantDisks: predominantDisks };
}

const Hardware = React.createClass(
  { displayName: "System Info Widget"

  , getInitialState () {
      return _.merge( getPredominantDisks()
                    , getNetworkConfig()
                    , getSystemInformation()
                    );
    }

  , componentDidMount () {
      DS.addChangeListener( this.handleDisksChange );
      DM.requestDisksOverview();
      DM.subscribe( this.constructor.displayName );

      NS.addChangeListener( this.handleNetworkConfigChange );
      NM.requestNetworkConfig();
      NM.subscribe( this.constructor.displayName );

      SS.addChangeListener( this.handleHardwareChange );
      SM.requestSystemInfo( "hardware" );
      SM.requestSystemGeneralConfig();
      SM.subscribe( this.constructor.displayName );
    }

  , componentWillUnmount () {
      NS.removeChangeListener( this.handleNetworkConfigChange );
      NM.unsubscribe( this.constructor.displayName );

      SS.removeChangeListener( this.handleHardwareChange );
      SM.unsubscribe( this.constructor.displayName );
    }

  , handleDisksChange () {
      this.setState( getPredominantDisks() );
    }

  , handleNetworkConfigChange () {
      this.setState( getNetworkConfig() );
    }

  , handleHardwareChange () {
      this.setState( getSystemInformation() );
    }

  , createHardwareDetail ( name, value, detail ) {
      let content;

      if ( typeof value !== "undefined" ) {
        content = value;
      } else {
        content = <Throbber />;
      }

      return (
        <div className = "hardware-item">
          <span className = "hardware-name">{ name }</span>
          <span className = "hardware-value">{ content }</span>
          <span className = "hardware-detail">{ detail || "" }</span>
        </div>
      );
    }

  , render () {
      let hostname =
        _.get( this.state, "systemInformation.hostname" );

      if ( !hostname ) {
        hostname = <Throbber />;
      }

      let device = "iXsystems FreeNAS Mini";
      let version = "FreeNAS X v0.1";

      let cpuModel = _.get( this.state, "systemInformation.cpu_model" );
      let cpuCores = _.get( this.state, "systemInformation.cpu_cores" );
      let cpuSpeed;

      if ( cpuModel ) {
        cpuSpeed = cpuModel.match( /\d*\.?\d*.hz/gi )[0];
      }

      if ( cpuCores ) {
        cpuCores += " Cores";
      }

      let memorySize = _.get( this.state, "systemInformation.memory_size" );
      let memoryType;

      if ( memorySize ) {
        memorySize = ByteCalc.humanize( memorySize, { roundMode: "whole" } );
        memoryType = "1866MHz ECC";
      }

      let diskLabel = _.get( this.state, "predominantDisks[0]" );
      let diskSize;
      let diskCount;
      let diskType;

      if ( diskLabel ) {
        diskSize = this.state.predominantDisks[0]
                       .match( /\d+\s?[a-z]{1,2}\b/gi );
        diskCount = this.state.predominantDisks[1].length + " x " + diskSize;
        diskType = "7200rpm SATA";
      }

      return (
        <Widget
          title = "System Info"
          className = "system-info"
        >
          <span className = "property hostname">{ hostname }</span>
          <span className = "property device">{ device }</span>
          <span className = "property version">{ version }</span>
          <div className = "hardware-info">
            { this.createHardwareDetail( "CPU", cpuSpeed, cpuCores ) }
            { this.createHardwareDetail( "Memory", memorySize, memoryType ) }
            { this.createHardwareDetail( "Drives", diskCount, diskType ) }
          </div>
        </Widget>
      );
    }

  }
);


export default Hardware;
