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

      if ( this.chart ) {
      }
    }

  , createColumnData ( statdData ) {
      return statdData.map( function ( stat ) { return parseFloat( stat[1] ); } );
    }

  , createColumns () {
      var columns = [];
      columns.push( [ "System" ].concat( this.createColumnData( SS.getStatdData( "localhost.aggregation-cpu-sum.cpu-system.value" ) ) ) );
      columns.push( [ "User" ].concat( this.createColumnData( SS.getStatdData( "localhost.aggregation-cpu-sum.cpu-user.value" ) ) ) );
      columns.push( [ "Nice" ].concat( this.createColumnData( SS.getStatdData( "localhost.aggregation-cpu-sum.cpu-nice.value" ) ) ) );
      columns.push( [ "Idle" ].concat( this.createColumnData( SS.getStatdData( "localhost.aggregation-cpu-sum.cpu-idle.value" ) ) ) );
      columns.push( [ "Interrupt" ].concat( this.createColumnData( SS.getStatdData( "localhost.aggregation-cpu-sum.cpu-interrupt.value" ) ) ) );
      return columns;
    }

  , tick ( eventMask ) {
      if ( this.chart ) {
        if ( eventMask.endsWith( "received" ) ) {
          let updateReady = true;
          DATA_SOURCES.forEach( function checkDataReadiness( dataSource ) {
                                 if ( updateReady === true ) {
                                   updateReady = SS.getStatdData( dataSource ) !== undefined;
                                 }
                               }
                              );
          if ( updateReady ) {
            let columns = this.createColumns();
            // console.log( columns );
            this.chart.flow ( { columns: columns
                              , length: 0
                              }
                            );
          }
        }
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
