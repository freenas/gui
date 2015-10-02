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

var c3;

if ( typeof window !== "undefined" ) {
  c3 = require( "c3" );
} else {
  c3 = function () {
    return Promise().resolve( true );
  };
}

const dataSources =
  [ "localhost.aggregation-cpu-sum.cpu-system.value"
  , "localhost.aggregation-cpu-sum.cpu-user.value"
  , "localhost.aggregation-cpu-sum.cpu-nice.value"
  , "localhost.aggregation-cpu-sum.cpu-idle.value"
  , "localhost.aggregation-cpu-sum.cpu-interrupt.value"
  ];

// request data every 10 seconds for now
const frequency = 10;

const CPU = React.createClass(
  { componentDidMount () {
      let dataUser = [ "User" ].concat( ChartUtil.rand( 4, 8, 31 ) );
      let dataSystem = [ "System" ].concat( ChartUtil.rand( 1, 5, 31 ) );
      const now = moment().format();
      const startTime = moment( now ).subtract( frequency * 60, "seconds" ).format();

      SM.subscribeToPulse( this.constructor.displayName, dataSources );
      dataSources.forEach( function requestInitialData( dataSource ) {
                             SM.requestWidgetData( dataSource
                                                 // Get the first minute of data
                                                 , startTime
                                                 , now
                                                 , frequency + "S"
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
                      { max: 100
                      , min: 0
                      , padding: { top: 0, bottom: 0 }
                      , tick:
                        { values: [ 0, 25, 50, 75, 100 ]
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

      this.timeout = setTimeout( this.tick, 2000 );
    }

  , componentWillUnmount () {
      this.chart = null;
      clearTimeout( this.timeout );
      SM.unsubscribeFromPulse( this.constructor.displayName, dataSources );
      SS.removeChangeListener( this.tick );
    }

  , tick () {
      if ( this.chart ) {
        let newPointUser = [ "User" ].concat( ChartUtil.rand( 4, 8, 1 ) );
        let newPointSystem = [ "System" ].concat( ChartUtil.rand( 1, 5, 1 ) );
        this.chart.flow(
          { columns: [ newPointUser, newPointSystem ]
          }
        );
      }

      this.timeout = setTimeout( this.tick, 2000 );
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
