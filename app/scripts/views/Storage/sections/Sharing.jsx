// POOL/VOLUME DATASETS
// ====================
// A section of the Pool/Volume UI that shows the available storage devices,
// datasets, ZVOLs, etc.

"use strict";

import React from "react";

import Share from "./Sharing/Share";


const LEFT_PADDING = 32;

const Sharing = ( props ) => {
  const { rootDataset, ...other } = props;
  const CHILDREN = ( props.volumeShares && props.volumeShares.ROOT_DATASET )
                 ? props.volumeShares.ROOT_DATASET
                 : [];

  if ( CHILDREN ) {
    return (
      <Share
        { ...other }
        isRoot
        name = { props.volumeName }
        target = ""
        id     = "ROOT_DATASET"
        childShares = { props.volumeShares }
        children = { CHILDREN }
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
  { volumeName    : React.PropTypes.string

  // DATA
  , volumeShares  : React.PropTypes.object
  , shares      : React.PropTypes.object

  // GUI META
  , activeShare  : React.PropTypes.string

  // HANDLERS
  , onFocusShare         : React.PropTypes.func.isRequired
  , onBlurShare          : React.PropTypes.func.isRequired
  , onUpdateShare        : React.PropTypes.func.isRequired
  , onRevertShare        : React.PropTypes.func.isRequired
  , onSubmitShare        : React.PropTypes.func.isRequired
  , onRequestDeleteShare : React.PropTypes.func.isRequired
  };

export default Sharing;
