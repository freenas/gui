// CPU WIDGET
// ==========

import React from "react";

import ChartUtil from "../../../utility/ChartUtil";

var c3;

if ( typeof window !== "undefined" ) {
  c3 = require( "c3" );
} else {
  c3 = function () {
    return Promise().resolve( true );
  };
}

const CPU = React.createClass(
  { componentDidMount () {
      let data = [ "CPU %" ].concat( ChartUtil.rand( 2, 8, 61 ) );

      this.chart = c3.generate(
        { bindto: React.findDOMNode( this.refs.cpuChart )
        , data:
          { columns: [ data ]
          , type: "area"
          , groups: [[ "CPU %" ]]
          }
        , point:
          { show: false
          }
        , axis:
          { x:
            { show: false
            }
          , y:
            { padding: false
            , max: 90
            }
          }
        }
      );

      this.interval = setInterval( this.tick, 1000 );
    }

  , componentWillUnmount () {
      this.chart = null;
      clearInterval( this.interval );
    }

  , tick () {
      if ( this.chart ) {
        let newPoint = [ "CPU %" ].concat( ChartUtil.rand( 2, 8, 1 ) );
        this.chart.flow(
          { columns: [ newPoint ]
          }
        );
      }
    }

  , render () {
      return (
        <div
          className = "widget-chart"
          ref="cpuChart"
        />
      );
    }
  }
);

export default CPU;
