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

const Memory = React.createClass(
  { componentDidMount () {
      let active = [ "Active" ].concat( ChartUtil.rand( 0.4, 0.5, 61 ) );
      let cache = [ "Cache" ].concat( ChartUtil.rand( 0.002, 0.003, 61 ) );
      let wired = [ "Wired" ].concat( ChartUtil.rand( 1.1, 1.3, 61 ) );
      let inactive = [ "Inactive" ].concat( ChartUtil.rand( 0.2, 0.25, 61 ) );
      let free = this.calcFree( 61, active, cache, wired, inactive );

      this.chart = c3.generate(
        { bindto: React.findDOMNode( this.refs.cpuChart )
        , data:
          { columns: [ free, active, cache, wired, inactive ]
          , type: "area-step"
          , groups: [[ "Free", "Active", "Cache", "Wired", "Inactive" ]]
          }
        , point:
          { show: false
          }
        , axis:
          { x:
            { show: false
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

  , calcFree ( length, active, cache, wired, inactive ) {
      let free = [ "Free" ];

      // Start at 1 because the first value will be the category
      for ( let i = 1; i < length + 1; i++ ) {
        free.push( 30 - active[i] - cache[i] - wired[i] - inactive[i] );
      }

      return free;
    }

  , tick () {
      if ( this.chart ) {
        let active = [ "Active" ].concat( ChartUtil.rand( 0.4, 0.5, 1 ) );
        let cache = [ "Cache" ].concat( ChartUtil.rand( 0.002, 0.003, 1 ) );
        let wired = [ "Wired" ].concat( ChartUtil.rand( 1.1, 1.3, 1 ) );
        let inactive = [ "Inactive" ].concat( ChartUtil.rand( 0.2, 0.25, 1 ) );
        let free = this.calcFree( 1, active, cache, wired, inactive );

        this.chart.flow(
          { columns: [ free, active, cache, wired, inactive ]
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

export default Memory;
