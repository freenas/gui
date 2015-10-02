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

    const ROOT_DATASET = datasets && datasets[0]
                       ? datasets[0]
                       : undefined;

    const ACTIVE_SHARE = shares && ROOT_DATASET
                       ? shares.get( "/mnt/" + datasets[0].name )
                       : undefined;

    if ( ROOT_DATASET ) {
      return (
        <Dataset
          root
          { ...other }
          { ...ROOT_DATASET }
          shares      = { shares }
          activeShare = { ACTIVE_SHARE }
        />
      );
    } else {
      return (
        <h3 className="text-center">LOADING...</h3>
      );
    }
  }
}

Filesystem.propTypes =
  { datasets : React.PropTypes.array
  , shares   : React.PropTypes.instanceOf( Map )
  };
