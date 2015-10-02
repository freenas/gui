// NEW DATASET
// ===========
// UI to be show during the creation of a new dataset

"use strict";

import React from "react";

export default class NewDataset extends React.Component {
  render () {
    return (
        <h1>NEW DATASET</h1>
    );
  }
}

NewDataset.propTypes =
  { name             : React.PropTypes.string.isRequired
  , mountpoint       : React.PropTypes.string.isRequired
  , pool             : React.PropTypes.string.isRequired
  , root             : React.PropTypes.bool
  , children         : React.PropTypes.array
  , permissions_type : React.PropTypes.oneOf([ "PERM", "ACL" ])
  , type             : React.PropTypes.oneOf([ "FILESYSTEM", "VOLUME" ])
  , share_type       : React.PropTypes.oneOf([ "UNIX", "MAC", "WINDOWS" ])
  , properties       : React.PropTypes.object // TODO: Get more specific
  , handlers : React.PropTypes.shape(
      { onDatasetChange : React.PropTypes.func.isRequired
      , nameIsPermitted : React.PropTypes.func.isRequired
      }
    ).isRequired
  };
