// CPU WIDGET
// ==========

"use strict";

import _ from "lodash";
import React from "react";
import moment from "moment";

import Widget from "../Widget";
import ChartUtil from "../../../utility/ChartUtil";
import c3Defaults from "../../../constants/c3Defaults";

import SM from "../../../flux/middleware/StatdMiddleware";
import SS from "../../../flux/stores/StatdStore";

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
  , "localhost.aggregation-cpu-sum.cpu-nice.value"
  , "localhost.aggregation-cpu-sum.cpu-idle.value"
  , "localhost.aggregation-cpu-sum.cpu-interrupt.value"
  ];

// request data every 10 seconds for now
const FREQUENCY = 10;

const CPU = React.createClass(
  { componentDidMount () {
      let dataUser = [ "User" ].concat( ChartUtil.rand( 4, 8, 31 ) );
      let dataSystem = [ "System" ].concat( ChartUtil.rand( 1, 5, 31 ) );
      const now = moment().format();
      const startTime = moment( now ).subtract( FREQUENCY * 60, "seconds" ).format();

      SM.subscribeToPulse( this.constructor.displayName, DATA_SOURCES );
      SS.addChangeListener( this.tick );
      DATA_SOURCES.forEach( function requestInitialData( dataSource ) {
                              SM.requestWidgetData( dataSource
                                                  // Get the first minute of data
                                                  , startTime
                                                  , now
                                                  , FREQUENCY + "S"
                                                  );
                            }
                          );

      this.chart = c3.generate(
        _.assign( {}
                , c3Defaults
                , { bindto: React.findDOMNode( this.refs.cpuChart )
                  , data:
                    { columns: [ dataUser, dataSystem ]
                    , type: "area"
                    , groups: [[ "User", "System" ]]
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
      SM.unsubscribeFromPulse( this.constructor.displayName, DATA_SOURCES );
      SS.removeChangeListener( this.tick );
    }

  , createColumnData ( statData ) {
      return statData.map( function ( stat ) { return parseFloat( stat[1] ); } );
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
        let newPointUser = [ "User" ].concat( ChartUtil.rand( 4, 8, 1 ) );
        let newPointSystem = [ "System" ].concat( ChartUtil.rand( 1, 5, 1 ) );
        this.chart.flow(
          { columns: [ newPointUser, newPointSystem ]
          }
        );
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
