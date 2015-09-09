// CPU WIDGET
// ==========

"use strict";

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
      let dataUser = [ "User" ].concat( ChartUtil.rand( 4, 8, 31 ) );
      let dataSystem = [ "System" ].concat( ChartUtil.rand( 1, 5, 31 ) );

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
