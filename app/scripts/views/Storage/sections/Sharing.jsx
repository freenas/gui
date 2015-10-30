// POOL/VOLUME DATASETS
// ====================
// A section of the Pool/Volume UI that shows the available storage devices,
// datasets, ZVOLs, etc.

"use strict";

import React from "react";

import Share from "./Sharing/Share";

export default class Sharing extends React.Component {

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
        <Share
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

Sharing.propTypes =
  { datasets      : React.PropTypes.array
  , pool          : React.PropTypes.string
  , activeShare   : React.PropTypes.string
  , shares        : React.PropTypes.object
  , onUpdateShare : React.PropTypes.func.isRequired
  , onRevertShare : React.PropTypes.func.isRequired
  , onSubmitShare : React.PropTypes.func.isRequired
  , onRequestDeleteShare : React.PropTypes.func.isRequired
  };
