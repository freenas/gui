// NETWORK WIDGET
// ==========

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

const Network = React.createClass(
  { componentDidMount () {
      let dataIn = [ "igb0 Down" ].concat( ChartUtil.rand( 0, 40, 31 ) );
      let dataOut = [ "igb0 Up" ].concat( ChartUtil.rand( -25, 0, 31 ) );

      this.chart = c3.generate(
        _.assign( {}
                , c3Defaults
                , { bindto: React.findDOMNode( this.refs.networkChart )
                  , data:
                    { columns: [ dataIn, dataOut ]
                    , type: "area"
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
                        { values: [ -150, -100, -50, 0, 50, 100, 150 ]
                        , format: function ( x ) { return Math.abs( x ); }
                        }
                      , min: -150
                      , center: 0
                      , max: 150
                      }
                    }
                  , tooltip:
                    { format:
                      { value: function ( value, ratio, id ) {
                          return ByteCalc.humanize( Math.abs( value ) );
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
        let newDown = [ "igb0 Down" ].concat( ChartUtil.rand( 0, 40, 1 ) );
        let newUp = [ "igb0 Up" ].concat( ChartUtil.rand( -25, 0, 1 ) );

        this.chart.flow(
          { columns: [ newDown, newUp ]
          }
        );
      }

      this.timeout = setTimeout( this.tick, 2000 );
    }

  , render () {
      return (
        <Widget title="Network Traffic">
          <div
            ref = "networkChart"
            className = "widget-chart"
          />
        </Widget>
      );
    }
  }
);

export default Network;
