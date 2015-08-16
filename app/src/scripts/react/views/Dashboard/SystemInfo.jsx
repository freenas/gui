// System Info Widget
// ==================
// Dashboard Widget for display basic system information.

"use strict";

import React from "react";

import Widget from "../../components/Widget";

import SM from "../../../flux/middleware/SystemMiddleware";
import SS from "../../../flux/stores/SystemStore";

import ByteCalc from "../../../utility/ByteCalc";

const SystemInfo = React.createClass(

  { getInitialState: function () {
    return { storeHydrated: false }
  }

  , componentDidMount: function () {
    SS.addChangeListener( this.handleSystemChange );

    SM.requestSystemInfo( "hardware" );
    SM.requestSystemInfo( "version" );
  }

  , componentWillUnmount: function () {
    SS.removeChangeListener( this.handleSystemChange );
  }

  , handleSystemChange: function () {
    this.setState( { storeHydrated: true } );
  }

  , render: function () {

    var memSize = SS.getSystemInfo( "hardware" )
                ? ByteCalc.humanize( SS.getSystemInfo( "hardware" )[ "memory_size" ] )
                : "";
    var cpuModel = SS.getSystemInfo( "hardware" )
                 ? SS.getSystemInfo( "hardware" )[ "cpu_model" ]
                 : "";
    var cpuCores = SS.getSystemInfo( "hardware" )
                 ? SS.getSystemInfo( "hardware" )[ "cpu_cores" ]
                 : "";
    var version = SS.getSystemInfo( "version" )
                ? SS.getSystemInfo( "version" )[ "version" ]
                : "";

    return (
      <Widget
        dimensions = { this.props.dimensions }
        title = { this.props.title }
        size = { this.props.size } >

        <div className = "wd-section wd-cpu-model">
          <span className = "wd-title">CPU Model:</span>
          <span className = "wd-value">{ cpuModel }</span>
          <span className = "wd-value">{ "with "
                                       + cpuCores
                                       + " cores." }</span>
        </div>
        <div className = "wd-section wd-memory-size">
          <span className = "wd-title">Memory Size:</span>
          <span className = "wd-value">{ memSize }</span>
        </div>
        <div className = "wd-section wd-version">
          <span className = "wd-title">Version:</span>
          <span className = "wd-value">{ version }</span>
        </div>

      </Widget>
    );
  }
});

export default SystemInfo;
