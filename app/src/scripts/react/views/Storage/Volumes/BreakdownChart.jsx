// VOLUME USAGE STACKED GRAPH
// ==========================
// Shows the usage of resources in a pool, including parity information.

"use strict";

import React from "react";
import TWBS from "react-bootstrap";

import ByteCalc from "../../../../utility/ByteCalc";

const BreakdownChart = React.createClass(

  { getDefaultProps: function () {
    return { used   : 0
           , free   : 0
           , parity : 0
           , total  : 0
           };
  }

  , calcPercent: function ( section ) {
    if ( this.props.total > 0 ) {
      return Math.floor( ( this.props[ section ] / this.props.total ) * 100 );
    } else {
      return 0;
    }
  }

  , render: function () {
      return (
        <TWBS.ProgressBar
          style = { this.props.total > 0
                  ? {}
                  : { opacity: 0, height: 0 }
                  }
        >
          <TWBS.ProgressBar
            label   = "Parity"
            bsStyle = "info"
            now     = { this.calcPercent( "parity" ) || 0 }
            key     = { 0 }
          />
          <TWBS.ProgressBar
            label   = "Used"
            bsStyle = "primary"
            now     = { this.calcPercent( "used" ) || 0 }
            key     = { 1 }
          />
          <TWBS.ProgressBar
            label     = { ByteCalc.humanize( this.props.free ) + " Free" }
            className = "free-space"
            now       = { this.calcPercent( "free" ) || 0 }
            key       = { 2 }
          />
        </TWBS.ProgressBar>
      );
    }

  }
);

export default BreakdownChart;
