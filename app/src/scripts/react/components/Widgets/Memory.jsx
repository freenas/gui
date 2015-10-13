// CPU WIDGET
// ==========

"use strict";

import _ from "lodash";
import React from "react";

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

const DATA_SOURCES =
  [ "localhost.memory.memory-active.value"
  , "localhost.memory.memory-cache.value"
  , "localhost.memory.memory-wired.value"
  , "localhost.memory.memory-inactive.value"
  , "localhost.memory.memory-free.value"
  ];

// hardcoded to 10 seconds
const FREQUENCY = 10;

const Memory = React.createClass(
  { propTypes: { subscribeToDataSources: React.PropTypes.func.isRequired }

  , getInitialState () {
      return { lastUpdateAt: 0 };
    }

  , componentDidMount () {
      this.props.subscribeToDataSources( DATA_SOURCES, FREQUENCY );

      let active = [ [ "Active" ], [] ];
      let cache = [ [ "Cache" ], [] ];
      let wired = [ [ "Wired" ], [] ];
      let inactive = [ [ "Inactive" ], [] ];
      let free = [ [ "Free" ], [] ];

      this.chart = c3.generate(
        _.assign( {}
                , c3Defaults
                , { bindto: this.refs.cpuChart
                  , data:
                    { columns: [ free, active, cache, wired, inactive ]
                    , type: "area-step"
                    , hide: [ "Free", "Inactive" ]
                    }
                  , point:
                    { show: false
                    }
                  , axis:
                    { x:
                      { show: false
                      }
                    , y:
                      { tick:
                        { format: function ( y ) {
                            return ByteCalc.humanize( y, { roundMode: 1 } );
                          }
                        }
                      }
                    }
                  , tooltip:
                    { format:
                      { value: function ( value, ratio, id ) {
                          return ByteCalc.humanize( value );
                        }
                      }
                    }
                  }
                )
              );
    }

  , componentWillUnmount () {
      this.chart = null;
    }

  , shouldComponentUpdate () {
      return false;
    }

    // Rather than manipulating state, we're using componentWillReceiveProps to
    // manipulate the chart ( if appropriate )
  , componentWillReceiveProps ( newProps ) {
      // Nothing happens without a chart
      if ( this.chart ) {
        // Only tick the graph if the data is complete
        if ( ChartUtil.validateCompleteStats( newProps.statdData
                                            , DATA_SOURCES
                                            , FREQUENCY
                                            ) ) {
          this.tick( newProps.statdData );
        }
      }
    }

  , tick ( newStatdData ) {
      var columns = [];
      var newData = {};
      var newUpdateAt = 0;

      DATA_SOURCES.forEach(
        function trimData ( dataSource ) {
          let dataToUse = newStatdData[ dataSource ];
          _.remove( dataToUse
                  , function ( datapoint ) {
                      return datapoint[0] < this.state.lastUpdateAt;
                    }
                  , this
                  );
          newData[ dataSource ] =
            dataToUse.map( function ( datapoint ) {
                             newUpdateAt = _.max( [ newUpdateAt
                                                  , datapoint[0]
                                                  ] );
                             return parseInt( datapoint[1] );
                           }
                         );
        }
      , this
      );

      columns.push( [ "Active" ].concat( newData[ "localhost.memory.memory-active.value" ] ) );
      columns.push( [ "Cache" ].concat( newData[ "localhost.memory.memory-cache.value" ] ) );
      columns.push( [ "Wired" ].concat( newData[ "localhost.memory.memory-wired.value" ] ) );
      columns.push( [ "Inactive" ].concat( newData[ "localhost.memory.memory-inactive.value" ] ) );
      columns.push( [ "Free" ].concat( newData[ "localhost.memory.memory-free.value" ] ) );

      if ( _.all( columns, function ( column ) { return column.length > 1; } ) ) {
        let length = 0; // TODO: Make sure to choose this properly
        this.chart.flow( { columns: columns
                         , length: 0
                         } );
        this.setState( { lastUpdateAt: newUpdateAt } );
      }
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
