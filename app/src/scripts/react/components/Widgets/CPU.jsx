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

const CPU = React.createClass(
  { componentDidMount () {
      let data = [ "CPU Usage" ].concat( ChartUtil.rand( 2, 8, 31 ) );

      this.chart = c3.generate(
        _.assign( {}
                , c3Defaults
                , { bindto: React.findDOMNode( this.refs.cpuChart )
                  , data:
                    { columns: [ data ]
                    , type: "area"
                    , groups: [[ "CPU Usage" ]]
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
    }

  , tick () {
      if ( this.chart ) {
        let newPoint = [ "CPU Usage" ].concat( ChartUtil.rand( 2, 8, 1 ) );
        this.chart.flow(
          { columns: [ newPoint ]
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
