// VOLUME USAGE STACKED GRAPH
// ==========================
// Shows the usage of resources in a pool, including parity information.

"use strict";

import React from "react";
import TWBS from "react-bootstrap";

import ByteCalc from "../../../../utility/ByteCalc";

const HUMAN_TYPES =
  { used   : "Used"
  , free   : "Usable"
  , parity : "Parity"
  , total  : "Total"
  };

const BreakdownChart = React.createClass(

  { getDefaultProps () {
      return { used   : 0
             , free   : 0
             , parity : 0
             , total  : 0
             };
    }

  , calcPercent ( section ) {
      if ( typeof this.props[ section ] === "number"
           && this.props[ section ] > 0 ) {
        return Math.floor( ( this.props[ section ] / this.props.total ) * 100 );
      } else {
        return 0;
      }
    }

  , formatLabel ( type, percent ) {
      let label = [];

      if ( percent > 20 ) {
        label.push( ByteCalc.humanize( this.props[ type ] ) );
      }

      if ( percent > 10 ) {
        label.push( HUMAN_TYPES[ type ] );
      }

      return label.join( " " );
    }

  , render () {
      let percentParity = this.calcPercent( "parity" );
      let percentUsed   = this.calcPercent( "used" );
      let percentFree   = this.calcPercent( "free" );

      return (
        <TWBS.ProgressBar
          style = { this.props.total > 0
                  ? {}
                  : { opacity: 0, height: 0 }
                  }
        >
          <TWBS.ProgressBar
            label   = { this.formatLabel( "parity", percentParity ) }
            bsStyle = "info"
            now     = { percentParity }
            key     = { 0 }
          />
          <TWBS.ProgressBar
            label   = { this.formatLabel( "used", percentUsed ) }
            bsStyle = "primary"
            now     = { percentUsed }
            key     = { 1 }
          />
          <TWBS.ProgressBar
            label     = { this.formatLabel( "free", percentFree ) }
            className = "free-space"
            now       = { percentFree }
            key       = { 2 }
          />
        </TWBS.ProgressBar>
      );
    }

  }
);

export default BreakdownChart;
