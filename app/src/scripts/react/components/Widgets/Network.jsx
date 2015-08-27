// NETWORK WIDGET
// ==========

import React from "react";

import Widget from "../Widget";
import ChartUtil from "../../../utility/ChartUtil";

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
      let dataOut = [ "igb0 Up" ].concat( ChartUtil.rand( 0, 25, 31 ) );

      this.chartIn = c3.generate(
        { bindto: React.findDOMNode( this.refs.nwIn )
        , data:
          { columns: [ dataIn ]
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
              { values: [ 0, 50, 100, 150 ]
              }
            , max: 150
            }
          }
        }
      );

      this.chartOut = c3.generate(
        { bindto: React.findDOMNode( this.refs.nwOut )
        , data:
          { columns: [ dataOut ]
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
              { values: [ 0, 50, 100, 150 ]
              }
            , max: 150
            , inverted: true
            }
          }
        }
      );

      this.timeout = setTimeout( this.tick, 2000 );
    }

  , componentWillUnmount () {
      this.chartIn = null;
      this.chartOut = null;
      clearTimeout( this.timeout );
    }

  , tick () {
      if ( this.chartIn ) {
        let newPoint = [ "igb0 Down" ].concat( ChartUtil.rand( 0, 40, 1 ) );
        this.chartIn.flow(
          { columns: [ newPoint ]
          }
        );
      }

      if ( this.chartOut ) {
        let newPoint = [ "igb0 Up" ].concat( ChartUtil.rand( 0, 25, 1 ) );
        this.chartOut.flow(
          { columns: [ newPoint ]
          }
        );
      }

      this.timeout = setTimeout( this.tick, 2000 );
    }

  , render () {
      return (
        <Widget title="Network Traffic">
          <div className="network-widget-dual">
            <div
              ref = "nwIn"
              className = "widget-chart"
            />
            <div
              ref = "nwOut"
              className = "widget-chart"
            />
          </div>
        </Widget>
      );
    }
  }
);

export default Network;
