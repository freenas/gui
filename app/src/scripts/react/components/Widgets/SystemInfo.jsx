// SYSTEM INFO WIDGET
// ==================

"use strict";

import _ from "lodash";
import React from "react";
import { Table } from "react-bootstrap";
import Throbber from "../Throbber";
import Widget from "../Widget";

import ByteCalc from "../../../utility/ByteCalc";

const SystemInfo = React.createClass(
  { displayName: "System Info Widget"

  , propTypes: { version: React.PropTypes.string
               , cpu_model: React.PropTypes.string
               , cpu_cores: React.PropTypes.string
               , memory_size: React.PropTypes.string
               , predominantDisks: React.PropTypes.string
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
        _.get( this.props, "hostname" );

      if ( !hostname ) {
        hostname = <Throbber />;
      }

      let version = _.get( this.props, "version" );

      let cpuModel = _.get( this.props, "cpu_model" );
      let cpuCores = _.get( this.props, "cpu_cores" );
      let cpuSpeed;

      if ( cpuModel ) {
        cpuSpeed = cpuModel.match( /\d*\.?\d*.hz/gi )[0];
      }

      if ( cpuCores ) {
        cpuCores += " Cores";
      }

      let memorySize = _.get( this.props, "memory_size" );
      let memoryType;

      if ( memorySize ) {
        memorySize = ByteCalc.humanize( memorySize, { roundMode: "whole" } );
      }

      let diskLabel = _.get( this.props, "predominantDisks[0]" );
      let diskSize;
      let diskCount;
      let diskType;

      if ( diskLabel ) {
        diskSize = this.props.predominantDisks[0]
                       .match( /\d+\s?[a-z]{1,2}\b/gi );
        diskCount = this.props.predominantDisks[1].length + " x " + diskSize;
        diskType = "7200rpm SATA";
      }

      return (
        <Widget
          className = "system-info"
        >
          <div className="system-properties">
            <h2 className="hostname">{ hostname }</h2>
            <Table>
              <tr>
                <td className = "property-label">OS Version</td>
                <td className = "property version">{ version }</td>
              </tr>
            </Table>
          </div>
          <div className = "hardware-info">
            { this.createHardwareDetail( "CPU", cpuSpeed, cpuCores ) }
            { this.createHardwareDetail( "Memory", memorySize ) }
            { this.createHardwareDetail( "Drives", diskCount, diskType ) }
          </div>
        </Widget>
      );
    }

  }
);

export default SystemInfo;
