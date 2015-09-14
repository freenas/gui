// CPU Usage Meter
// ===============
// Half-circle graph depicting distribution of CPU resources at that moment

"use strict";

import React from "react";
import _ from "lodash";

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

const CPUMeter = React.createClass(
  { componentDidMount () {
    let dataUser = [ "User" ].concat( ChartUtil.rand( 4, 8, 1 ) );
    let dataSystem = [ "System" ].concat( ChartUtil.rand( 1, 5, 1 ) );
    let idle = [ "Idle", 100 - dataUser[1] - dataSystem[1] ];

  this.chart = c3.generate(
      _.assign( {}
              , { color:
                  { pattern: [ "#0196D8", "#B8252F", "#E9E9E9" ]
                  }
                }
              , { bindto: React.findDOMNode( this.refs.cpuMeter )
                , data:
                  { columns: [ dataUser, dataSystem, idle ]
                  , type: "donut"
                  }
                , padding: {
                  top: 0,
                  right: 0,
                  bottom: 0,
                  left: 0,
                }
                , legend: {
                    hide: true
                  }
                , donut:
                  { label:
                      { title: "CPU Use"
                      , show: false
                      }
                  , title: "CPU %"
                  , expand: false
                  }
                //, legend: { hide: "Idle" }
                }
              )
    );

    this.timeout = setTimeout( this.update, 2000 );
  }

  , update () {
    if ( this.chart ) {
      let dataUser = [ "User" ].concat( ChartUtil.rand( 4, 8, 1 ) );
      let dataSystem = [ "System" ].concat( ChartUtil.rand( 1, 5, 1 ) );
      let idle = [ "Idle", 100 - dataUser[1] - dataSystem[1] ];

      let columns = [ dataUser, dataSystem, idle ];

      this.chart.load( { columns: columns } );
    }
    this.timeout = setTimeout( this.update, 2000 );
  }

  , render () {
    return(
      <Widget>
        <div ref = "cpuMeter"/>
      </Widget>
    );
  }
});

export default CPUMeter;
