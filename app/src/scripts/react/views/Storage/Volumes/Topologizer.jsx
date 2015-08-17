// TOPOLOGIZER TOOL
// ================
// Reconfigures pool topology according to the position of controls, splitting
// between performance, data security, and capacity.

"use strict";

import React from "react";

const Topologizer = React.createClass(
  { render () {
      return (
        <div className = "topologizer">
          <span className = "topologizer-label-health">
            {"Safety"}
          </span>
          <span className = "topologizer-label-speed">
            {"Speed"}
          </span>
          <span className = "topologizer-label-size">
            {"Storage"}
          </span>
          <div className = "topologizer-bounding">
            <div className = "topologizer-handle" />
          </div>
          <div className = "toppologizer-wrap">
            <span className = "toppologizer-triangle-wrap">
              <span className = "topologizer-triangle">
                <span className = "topologizer-health" />
                <span className = "topologizer-speed" />
                <span className = "topologizer-size" />
              </span>
            </span>
          </div>
        </div>
      );
    }

  }
);

export default Topologizer;
