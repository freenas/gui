// CPU Usage Meter
// ===============
// Half-circle graph depicting distribution of CPU resources at that moment

"use strict";

import React from "react";
import { ProgressBar } from "react-bootstrap";
import _ from "lodash";

import ChartUtil from "../../utility/ChartUtil";
const CPUMeter = React.createClass(
  { componentDidMount () {
      this.timeout = setTimeout( this.update, 0 );
    }

  , componentWillUnmount () {
      clearTimeout( this.timeout );
      this.timeout = null;
    }

  , getInitialState() {
      return { user   : 0
             , system : 0
             };
    }

  , update () {
      this.setState( { user: ChartUtil.rand( 20, 35, 1 )[0]
                     , system: ChartUtil.rand( 30, 40, 1 )[0]
                     } );

      this.timeout = setTimeout( this.update, 2000 );
    }

  , render () {
      return(
        <div>
          <h5>{"CPU Resource Usage"}</h5>
          <ProgressBar>
            <ProgressBar
              key = {0}
              now = { this.state.user }
              label = "User"
              bsStyle = "success"
            />
            <ProgressBar
              key = {1}
              now = { this.state.system }
              label = "System"
              bsStyle = "warning"
            />
          </ProgressBar>
        </div>
      );
    }
  }
);

export default CPUMeter;
