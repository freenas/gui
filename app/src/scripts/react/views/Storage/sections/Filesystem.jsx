// POOL/VOLUME DATASETS
// ====================
// A section of the Pool/Volume UI that shows the available storage devices,
// datasets, ZVOLs, etc.

"use strict";

import React from "react";
import { Well } from "react-bootstrap";

import Dataset from "./Filesystem/Dataset";

export default class Filesystem extends React.Component {
  render () {
    console.log( this.props.datasets );
    return (
      <Well
        style = { this.props.style }
      >
        <Dataset />
      </Well>
    );
  }
}
