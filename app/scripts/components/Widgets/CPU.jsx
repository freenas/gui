// CPU WIDGET
// ==========

"use strict";

import _ from "lodash";
import React from "react";
import moment from "moment";

import Widget from "../Widget";
import ChartUtil from "../../utility/ChartUtil";
import c3Defaults from "../../constants/c3Defaults";

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

const FREQUENCY = 10;

const CPU = React.createClass(
  { propTypes: { subscribe: React.PropTypes.func.isRequired
               , cpu_cores: React.PropTypes.number
               }

  , getDefaultProps () {
      return { cpu_cores: 1
             , statdData: {}
             }
    }

  , getInitialState () {
      return { lastUpdateAt: 0 };
    }

  , componentDidMount () {
      this.props.fetchHistory( DATA_SOURCES );
      this.props.subscribe( DATA_SOURCES, "CPU Widget" );

      var dataSystem = [ "System", [] ];
      var dataUser = [ "User", [] ];
      var dataNice = [ "Nice", [] ];
      var dataIdle = [ "Idle", [] ];
      var dataInterrupt = [ "Interrupt", [] ];

      this.chart = c3.generate(
        _.assign( {}
                , c3Defaults
                , { bindto: this.refs.cpuChart
                  , data:
                    { columns: [ dataSystem
                               , dataUser
                               , dataNice
                               , dataIdle
                               , dataInterrupt
                               ]
                    , type: "area"
                    , groups: [[ "System", "User", "Nice", "Idle", "Interrupt" ]]
                    , hide: [ "Nice", "Idle", "Interrupt" ]
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
      this.props.unsubscribe( DATA_SOURCES, "CPU Widget" );
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
                             return parseFloat( datapoint[1] );
                           }
                         );
        }
      , this
      );

      columns.push( [ "System" ].concat( newData[ "localhost.aggregation-cpu-sum.cpu-system.value" ] ) );
      columns.push( [ "User" ].concat( newData[ "localhost.aggregation-cpu-sum.cpu-user.value" ] ) );
      columns.push( [ "Nice" ].concat( newData[ "localhost.aggregation-cpu-sum.cpu-nice.value" ] ) );
      columns.push( [ "Idle" ].concat( newData[ "localhost.aggregation-cpu-sum.cpu-idle.value" ] ) );
      columns.push( [ "Interrupt" ].concat( newData[ "localhost.aggregation-cpu-sum.cpu-interrupt.value" ] ) );

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
