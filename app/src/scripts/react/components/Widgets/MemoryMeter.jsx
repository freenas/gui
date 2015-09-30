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
      this.timeout = setTimeout( this.update, 0 );
    }

  , componentWillUnmount () {
      clearTimeout( this.timeout );
      this.timeout = null;
    }

  , getInitialState () {
      return ( { active : 0
               , cache  : 0
               , wired  : 0
               } );
    }

  , update () {
      this.setState( { active : ChartUtil.rand( 25, 30, 1 )[0]
                     , cache  : ChartUtil.rand( 30, 40, 1 )[0]
                     , wired  : ChartUtil.rand( 20, 30, 1 )[0]
                     } );

      this.timeout = setTimeout( this.update, 2000 );
    }

  , render () {
      return(
        <div>
          <h5>{"Memory Resource Usage"}</h5>
          <ProgressBar>
            <ProgressBar
              key = {0}
              now = { this.state.active }
              label = "Active"
              bsStyle = "success"
            />
            <ProgressBar
              key = {1}
              now = { this.state.cache }
              label = "Cache"
              bsStyle = "warning"
            />
            <ProgressBar
              key = {2}
              now = { this.state.wired }
              label = "Wired"
              bsStyle = "info"
            />
          </ProgressBar>
        </div>
      );
    }
  }
);

export default MemoryMeter;
