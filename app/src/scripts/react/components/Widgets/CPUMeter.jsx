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
              , c3Defaults
              , { bindto: React.findDOMNode( this.refs.cpuMeter )
                , data:
                  { columns: [ dataUser, dataSystem, idle ]
                  , type: "donut"
                  }
                , donut:
                  { label: { title: "CPU Use" }
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
      <Widget title = "CPU Use Ratio">
        <div ref = "cpuMeter"/>
      </Widget>
    );
  }
});

export default CPUMeter;
