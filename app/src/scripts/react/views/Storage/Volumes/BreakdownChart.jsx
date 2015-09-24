// VOLUME USAGE STACKED GRAPH
// ==========================
// Shows the usage of resources in a pool, including parity information.

"use strict";

import React from "react";
import { ProgressBar } from "react-bootstrap";

import ByteCalc from "../../../../utility/ByteCalc";

const HUMAN_TYPES =
  { used   : "Used"
  , free   : "Usable"
  , parity : "Parity"
  , total  : "Total"
  };

const BreakdownChart = React.createClass(

  { propTypes:
    { used   : React.PropTypes.number
    , free   : React.PropTypes.number
    , parity : React.PropTypes.number
    }

  , getDefaultProps () {
      return { used   : 0
             , free   : 0
             , parity : 0
             };
    }

  , calcPercent ( section, total ) {
      if ( this.props[ section ] > 0 ) {
        return Math.floor( ( this.props[ section ] / total ) * 100 );
      } else {
        return 0;
      }
    }

  , formatLabel ( type, percent ) {
      let label = [];

      if ( percent > 0 ) {
        label.push( ByteCalc.humanize( this.props[ type ] ) )
        label.push( HUMAN_TYPES[ type ] );
      }

      return label.join( " " );
    }

  , render () {
      const TOTAL = this.props.used + this.props.free + this.props.total;
      const PERCENT_PARITY = this.calcPercent( "parity", TOTAL );
      const PERCENT_USED   = this.calcPercent( "used", TOTAL );
      const PERCENT_FREE   = this.calcPercent( "free", TOTAL );

      return (
        <ProgressBar
          style = { this.props.total > 0
                  ? {}
                  : { opacity: 0, height: 0, marginTop: 0, marginBottom: 0 }
                  }
        >
          <ProgressBar
            label   = { this.formatLabel( "parity", PERCENT_PARITY ) }
            bsStyle = "info"
            now     = { PERCENT_PARITY }
            key     = { 0 }
          />
          <ProgressBar
            label   = { this.formatLabel( "used", PERCENT_USED ) }
            bsStyle = "primary"
            now     = { PERCENT_USED }
            key     = { 1 }
          />
          <ProgressBar
            label     = { this.formatLabel( "free", PERCENT_FREE ) }
            className = "free-space"
            now       = { PERCENT_FREE }
            key       = { 2 }
          />
        </ProgressBar>
      );
    }

  }
);

export default BreakdownChart;
