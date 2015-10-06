// CPU WIDGET
// ==========

"use strict";

import _ from "lodash";
import React from "react";
import moment from "moment";

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

const DATA_SOURCES =
  [ "localhost.aggregation-cpu-sum.cpu-system.value"
  , "localhost.aggregation-cpu-sum.cpu-user.value"
  // , "localhost.aggregation-cpu-sum.cpu-nice.value"
  // , "localhost.aggregation-cpu-sum.cpu-idle.value"
  // , "localhost.aggregation-cpu-sum.cpu-interrupt.value"
  ];

// request data every 10 seconds for now
const FREQUENCY = 10;

const CPU = React.createClass(
  { propTypes: { subscribeToDataSources: React.PropTypes.func.isRequired
               , cpuCores: React.PropTypes.number
               }

  , getInitialState () {
      return { lastTickData: { "localhost.aggregation-cpu-sum.cpu-system.value": []
                             , "localhost.aggregation-cpu-sum.cpu-user.value": []
                             // , "localhost.aggregation-cpu-sum.cpu-nice.value": []
                             // , "localhost.aggregation-cpu-sum.cpu-idle.value": []
                             // , "localhost.aggregation-cpu-sum.cpu-interrupt.value": []
                             }
             };
    }

  , componentDidMount () {

      this.props.subscribeToDataSources( DATA_SOURCES, FREQUENCY );

      var dataSystem = [ "System", [] ];
      var dataUser = [ "User", [] ];
      // var dataNice = [ "Nice", [] ];
      // var dataIdle = [ "Idle", [] ];
      // var dataInterrupt = [ "Interrupt", [] ];

      this.chart = c3.generate(
        _.assign( {}
                , c3Defaults
                , { bindto: React.findDOMNode( this.refs.cpuChart )
                  , data:
                    { columns: [ dataSystem
                               , dataUser
                               // , dataNice
                               // , dataIdle
                               // , dataInterrupt
                               ]
                    , type: "area"
                    , groups: [[ "System", "User"/*, "Nice", "Idle", "Interrupt"*/ ]]
                    // , hide: [ "Nice", "Idle", "Interrupt" ]
                    }
                  , point:
                    { show: false
                    }
                  , axis:
                    { x:
                      { show: false
                      }
                    , y:
                      // the max and the tick values will be multiplied by the
                      // number of CPU cores available to the system.
                      { max: 100
                      , min: 0
                      , padding: { top: 0, bottom: 0 }
                      , tick:
                        { count: 5
                        , format: function ( x ) { return x + " %"; }
                        }
                      }
                    }
                  , tooltip:
                    { format:
                      { value: function ( value, ratio, id ) {
                          return Math.round( value ) + "%";
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
    // manipulate the chart ( if appropriate );
  , componentWillReceiveProps ( newProps ) {
      // Nothing happens without a chart
      if ( this.chart ) {
        this.chart.axis.max( { y: 100 * newProps.cpu_cores } );

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
      _.forOwn( newStatdData
              , function compareData ( data, key ) {
                  // Get only the actual data, not the timestamps
                  let dataToUse = _.map( data
                                       , function ( dataPoint ) {
                                           return parseFloat( dataPoint[1] );
                                         }
                                       );
                  if ( !_.isEmpty( this.state.lastTickData[ key ] ) ) {
                    newData[ key ] = _.without( dataToUse
                                              // Dangerous! Bad things happen if
                                              // a previously seen value occurs
                                              // again.
                                              , ...this.state.lastTickData[ key ]
                                              );
                  } else {
                    newData[ key ] = dataToUse;
                  }
                }
              , this
              );

      columns.push( [ "System" ].concat( newData[ "localhost.aggregation-cpu-sum.cpu-system.value" ] ) );
      columns.push( [ "User" ].concat( newData[ "localhost.aggregation-cpu-sum.cpu-user.value" ] ) );
      // columns.push( [ "Nice" ].concat( newData[ "localhost.aggregation-cpu-sum.cpu-nice.value" ] ) );
      // columns.push( [ "Idle" ].concat( newData[ "localhost.aggregation-cpu-sum.cpu-idle.value" ] ) );
      // columns.push( [ "Interrupt" ].concat( newData[ "localhost.aggregation-cpu-sum.cpu-interrupt.value" ] ) );

      var newTickData = null;

      if ( _.all( columns, function ( column ) { return column.length > 1; } ) ) {
        let length = 0; // TODO: Make sure to choose this properly
        this.chart.flow( { columns: columns
                         , length: 0
                         } );
        newTickData = {};
        _.forOwn( this.state.lastTickData
                , function ( column, key ) {
                  newTickData[ key ] = this.state.lastTickData[ key ].slice( length );
                  newTickData[ key ] = newTickData[ key ].concat( newData[ key ] );
                }
                , this
                );
        this.setState( { lastTickData: newTickData || this.state.lastTickData } );
      }
    }

  , render () {
      return (
        <Widget title="CPU Usage">
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
