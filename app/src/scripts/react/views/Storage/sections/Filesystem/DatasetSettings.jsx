// DATASET SETTINGS
// ================
// Display the available settings for a dataset

"use strict";

import React from "react";

// TODO: Find a better way to source this
const CONTAINER_PADDING = 15;

export default class DatasetSettings extends React.Component {
  render () {
    return (
      <div
        className = "dataset-settings"
        style     = {{ marginLeft: -this.props.shiftLeft - CONTAINER_PADDING }}
      >
        <span
          className = "pointer"
          style     = {{ left: this.props.shiftLeft }}
        />
        { "Settings" }
      </div>
    );
  }
}
