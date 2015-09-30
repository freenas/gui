// Memory Usage Donut
// =================
// Donut chart depicting distribution of memory resources at that moment

"use strict";

import React from "react";
import { ProgressBar } from "react-bootstrap";
import _ from "lodash";

import ChartUtil from "../../../utility/ChartUtil";
import ByteCalc from "../../../utility/ByteCalc";

const MemoryMeter = React.createClass(
  { componentDidMount () {
    this.timeout = setTimeout( this.update, 2000 );
  }

  , getInitialState () {
    let active = ChartUtil.rand( 20
                               , 25
                               , 1
                               );
    let cache = ChartUtil.rand( 30
                              , 40
                              , 1
                              );
    let wired = ChartUtil.rand( 20
                              , 30
                              , 1
                              );

    return ( { active : active
             , cache : cache
             , wired : wired
             } );
  }

  , update () {
    let active = ChartUtil.rand( 25
                               , 30
                               , 1
                               );
    let cache = ChartUtil.rand( 30
                              , 40
                              , 1
                              );
    let wired = ChartUtil.rand( 20
                              , 30
                              , 1
                              );

    this.setState( { active : active
                   , cache : cache
                   , wired : wired
                   } );

    this.timeout = setTimeout( this.update, 2000 );
  }

  , render () {
    return(
      <div>
        <h5>{"Memory Resource Usage"}</h5>
        <ProgressBar>
          <ProgressBar
            now = { this.state.active }
            label = "Active"
            bsStyle = "success"
          />
          <ProgressBar
            now = { this.state.cache }
            label = "Cache"
            bsStyle = "warning"
          />
          <ProgressBar
            now = { this.state.wired }
            label = "Wired"
            bsStyle = "info"
          />
        </ProgressBar>
      </div>
    );
  }
});

export default MemoryMeter;
