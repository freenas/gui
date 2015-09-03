// POOL/VOLUME DATASETS
// ====================
// A section of the Pool/Volume UI that shows the available storage devices,
// datasets, ZVOLs, etc.

"use strict";

import React from "react";
import { Well } from "react-bootstrap";

var PoolDatasets = React.createClass({

  render: function () {
    return (
      <Well
        style = { this.props.style }
      >
        <h1>Storage goes here, when you have it</h1>
      </Well>
    );
  }

});

export default PoolDatasets;
