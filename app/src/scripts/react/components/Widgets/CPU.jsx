// CPU WIDGET
// ==========

import _ from "lodash";
import React from "react";

import { Line as LineChart } from "react-chartjs";

import ChartUtil from "../../../utility/ChartUtil";

const CPU_OPTIONS =
  { animation              : false
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
  { getInitialState () {
    return (
      { cpuValues: ChartUtil.rand( 2, 8, 50 )
      , cpuLabels: _.fill( Array( 50 ), "" )
      }
    );
  }

  , componentDidMount () {
      this.interval = setInterval( this.tick, 1000 );
    }

  , componentWillUnmount () {
      clearInterval( this.interval );
    }

  , tick () {
      let newValues = this.state.cpuValues
                          .concat( ChartUtil.rand( 2, 8, 1 ) );

      newValues.splice( 0, 1 );

      this.setState(
        { cpuValues: newValues
        }
      );
    }

  , lie () {
      return (
        { labels: this.state.cpuLabels
        , datasets: ChartUtil.styleDatasets(
            [ { label: "CPU Usage"
              , data: this.state.cpuValues
              }
            ]
          )
        }
      );
    }

  , render () {
      return (
        <LineChart
          data = { this.lie() }
          options = { CHART_OPTIONS }
          />
      );
    }
  }
);

export default CPU;
