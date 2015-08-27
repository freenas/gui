// CPU WIDGET
// ==========

import React from "react";

import Widget from "../Widget";
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
      let data = [ "CPU %" ].concat( ChartUtil.rand( 2, 8, 31 ) );

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

      this.timeout = setTimeout( this.tick, 2000 );
    }

  , componentWillUnmount () {
      this.chart = null;
      clearTimeout( this.timeout );
    }

  , tick () {
      if ( this.chart ) {
        let newPoint = [ "CPU %" ].concat( ChartUtil.rand( 2, 8, 1 ) );
        this.chart.flow(
          { columns: [ newPoint ]
          }
        );
      }

      this.timeout = setTimeout( this.tick, 2000 );
    }

  , render () {
      return (
        <Widget title="CPU %">
          <div
            className = "widget-chart"
            ref="cpuChart"
          />
        </Widget>
      );
    }
  }
);

export default CPU;
