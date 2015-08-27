// CPU WIDGET
// ==========

import _ from "lodash";
import React from "react";

import Widget from "../Widget";
import ChartUtil from "../../../utility/ChartUtil";
import c3Defaults from "../../../constants/c3Defaults";

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
      let active = [ "Active" ].concat( ChartUtil.rand( 0.4, 0.5, 31 ) );
      let cache = [ "Cache" ].concat( ChartUtil.rand( 0.002, 0.003, 31 ) );
      let wired = [ "Wired" ].concat( ChartUtil.rand( 1.1, 1.3, 31 ) );
      let inactive = [ "Inactive" ].concat( ChartUtil.rand( 0.2, 0.25, 31 ) );
      let free = this.calcFree( 31, active, cache, wired, inactive );

      this.chart = c3.generate(
        _.assign( {}
                , c3Defaults
                , { bindto: React.findDOMNode( this.refs.cpuChart )
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
                )
              );

      this.timeout = setTimeout( this.tick, 2000 );
    }

  , componentWillUnmount () {
      this.chart = null;
      clearTimeout( this.timeout );
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

      this.timeout = setTimeout( this.tick, 2000 );
    }

  , render () {
      return (
        <Widget title="Memory Allocation">
          <div
            className = "widget-chart"
            ref="cpuChart"
          />
        </Widget>
      );
    }
  }
);

export default Memory;
