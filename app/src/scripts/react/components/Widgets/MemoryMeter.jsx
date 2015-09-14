// Memory Usage Donut
// =================
// Donut chart depicting distribution of memory resources at that moment

"use strict";

import React from "react";
import _ from "lodash";

import Widget from "../Widget";
import ChartUtil from "../../../utility/ChartUtil";
import ByteCalc from "../../../utility/ByteCalc";
import c3Defaults from "../../../constants/c3Defaults";

var c3;

if ( typeof window !== "undefined" ) {
  c3 = require( "c3" );
} else {
  c3 = function () {
    return Promise().resolve( true );
  };
}

const MemoryMeter = React.createClass(
  { componentDidMount () {

    let active = [ "Active" ].concat( ChartUtil.rand( 400000000
                                                    , 500000000
                                                    , 1
                                                    )
                                    );
    let cache = [ "Cache" ].concat( ChartUtil.rand( 2000000
                                                  , 3000000
                                                  , 1
                                                  )
                                  );
    let wired = [ "Wired" ].concat( ChartUtil.rand( 1100000000
                                                  , 1300000000
                                                  , 1
                                                  )
                                  );
    let inactive = [ "Inactive" ].concat( ChartUtil.rand( 200000000
                                                        , 250000000
                                                        , 1
                                                        )
                                        );
    let free = this.calcFree( 1, active, cache, wired, inactive );

    this.chart = c3.generate(
      _.assign( {}
              , { color:
                  { pattern: [ "#E9E9E9", "#B8252F", "#7045B2", "#F5E923", "#0DC92E" ]
                  }
                }
              , { bindto: React.findDOMNode( this.refs.memoryMeter )
                , data:
                  { columns: [ free, active, cache, wired, inactive ]
                  , type: "donut"
                  }
                , legend: {
                    hide: true
                  }
                , padding: {
                  top: 0,
                  right: 0,
                  bottom: 0,
                  left: 0,
                }
                , donut:
                  { label:
                    { title: "Memory Use"
                    , show: false
                    , format: function ( value ) {
                      return ByteCalc.humanize( value );
                    }
                    }
                  , title: "MEMORY"
                  , expand: false
                  }
                , tooltip:
                  { format:
                    { value: function ( value ) {
                      return ByteCalc.humanize( value );
                    }
                  }
                // these don't work for some reason
                // , size: { width: "10em" }
                // , legend:
                //   { position: "right"  }
                }
              }
            )
    );

    this.timeout = setTimeout( this.update, 2000 );
  }

  , componentWillUnmount () {
    this.chart = null;
    clearTimeout( this.timeout );
  }

  , calcFree ( length, active, cache, wired, inactive ) {
    let free = [ "Free" ];

    // Start at 1 because the first value will be the category
    for ( let i = 1; i < length + 1; i++ ) {
      free.push( 32768000000 - active[i] - cache[i] - wired[i] - inactive[i] );
    }

    return free;
  }

  , update () {
    if ( this.chart ) {
      let active = [ "Active" ].concat( ChartUtil.rand( 400000000, 500000000, 1 ) );
      let cache = [ "Cache" ].concat( ChartUtil.rand( 2000000, 3000000, 1 ) );
      let wired = [ "Wired" ].concat( ChartUtil.rand( 1100000000, 1300000000, 1 ) );
      let inactive = [ "Inactive" ].concat( ChartUtil.rand( 200000000, 250000000, 1 ) );
      let free = this.calcFree( 1, active, cache, wired, inactive );

      let columns = [ free, active, cache, wired, inactive ];

      this.chart.load( {columns: columns} );
    }
    this.timeout = setTimeout( this.update, 2000 );
  }

  , render () {
    return(
      <Widget>
        <div ref = "memoryMeter"/>
      </Widget>
    );
  }
});

export default MemoryMeter;
