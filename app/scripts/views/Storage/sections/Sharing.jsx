// POOL/VOLUME DATASETS
// ====================
// A section of the Pool/Volume UI that shows the available storage devices,
// datasets, ZVOLs, etc.

"use strict";

import React from "react";

import VolumeUtilities from "../../../utility/VolumeUtilities";

import Share from "./Sharing/Share";


const LEFT_PADDING = 32;

const Sharing = ( props ) => {
  const { rootDataset, ...other } = props;

  if ( props.rootDataset ) {
    const combinedShares = Object.assign( {}
                                        , props.shares.serverShares
                                        , props.shares.clientShares
                                        );
    const childShares = VolumeUtilities.nestShares( combinedShares, rootDataset.mountpoint );
    return (
      <Share
        isRoot
        { ...other }
        { ...props.rootDataset }
        target = ""
        id     = "ROOT_DATASET"
        childShares = { childShares }
        children = { Object.keys( childShares ) }
        depth = { 0 }
        indent = { LEFT_PADDING }
      />
    );
  } else {
    return (
      <h3 className="text-center">LOADING...</h3>
    );
  }
}

Sharing.propTypes =
  { datasets      : React.PropTypes.object
  , rootDataset   : React.PropTypes.object
  , activeShare   : React.PropTypes.string
  , shares        : React.PropTypes.object
  , onBlurShare : React.PropTypes.func.isRequired
  , onFocusShare : React.PropTypes.func.isRequired
  , onUpdateShare : React.PropTypes.func.isRequired
  , onRevertShare : React.PropTypes.func.isRequired
  , onSubmitShare : React.PropTypes.func.isRequired
  , onRequestDeleteShare : React.PropTypes.func.isRequired
  };

export default Sharing;
