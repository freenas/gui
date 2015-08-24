// CPU WIDGET
// ==========

import _ from "lodash";
import React from "react";

import ChartUtil from "../../../utility/ChartUtil";

var Chart;

if ( typeof window !== "undefined" ) {
  Chart = require( "chart.js" );
} else {
  Chart = function () {
    return Promise().resolve( true );
  };
}

const CPU_OPTIONS =
  { animation              : true
  , bezier                 : true
  , bezierCurveTension     : 0.01
  , scaleShowVerticalLines : false
  , scaleOverride          : true
  , scaleSteps             : 4
  , scaleStepWidth         : 25
  , scaleBeginAtZero       : true
  , showTooltips           : false
  , pointDot               : false
  };

const CHART_OPTIONS = ChartUtil.getChartStyles( CPU_OPTIONS );

const CPU = React.createClass(
  { componentDidMount () {
      let ctx = React.findDOMNode( this.refs.cpuChart ).getContext( "2d" );

      this.chart = new Chart( ctx ).Line( this.lie(), CHART_OPTIONS );
      this.interval = setInterval( this.tick, 1000 );
    }

  , componentWillUnmount () {
      this.chart = null;
      clearInterval( this.interval );
    }

  , tick () {
      if ( this.chart ) {
        this.chart.addData( ChartUtil.rand( 2, 8, 1 ), "" );
        this.chart.removeData();
      }
    }

  , lie () {
      return (
        { labels: _.fill( Array( 50 ), "" )
        , datasets: ChartUtil.styleDatasets(
            [ { label: "CPU Usage"
              , data: ChartUtil.rand( 2, 8, 50 )
              }
            ]
          )
        }
      );
    }

  , render () {
      return (
        <canvas ref="cpuChart" />
      );
    }
  }
);

export default CPU;
