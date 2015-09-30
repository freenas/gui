// CPU Usage Meter
// ===============
// Half-circle graph depicting distribution of CPU resources at that moment

"use strict";

import React from "react";
import { ProgressBar } from "react-bootstrap";
import _ from "lodash";

import ChartUtil from "../../../utility/ChartUtil";
const CPUMeter = React.createClass(
  { componentDidMount () {
    this.timeout = setTimeout( this.update, 2000 );
  }

  , getInitialState() {
    let dataUser = ChartUtil.rand( 20, 35, 1 );
    let dataSystem = ChartUtil.rand( 30, 40, 1 );

    return { user: dataUser
           , system: dataSystem
           };
  }

  , update () {
    let dataUser = ChartUtil.rand( 20, 35, 1 );
    let dataSystem = ChartUtil.rand( 30, 40, 1 );

    this.setState( { user: dataUser
                   , system: dataSystem
                   } );

    this.timeout = setTimeout( this.update, 2000 );
  }

  , render () {
    return(
      <div>
        <h5>{"CPU Resource Usage"}</h5>
        <ProgressBar>
          <ProgressBar
            now = { this.state.user }
            label = "User"
            bsStyle = "success"
          />
          <ProgressBar
            now = { this.state.system }
            label = "System"
            bsStyle = "warning"
          />
        </ProgressBar>
      </div>
    );
  }
});

export default CPUMeter;
