// POOL/VOLUME DATASETS
// ====================
// A section of the Pool/Volume UI that shows the available storage devices,
// datasets, ZVOLs, etc.

"use strict";

import React from "react";

import Dataset from "./Filesystem/Dataset";

export default class Filesystem extends React.Component {

  render () {
    const { datasets, shares, ...other } = this.props;

    return (
      <div { ...other }>
        <Dataset
          root
          { ...datasets[0] }
          shares = { shares }
        />
      </div>
    );
  }
}

