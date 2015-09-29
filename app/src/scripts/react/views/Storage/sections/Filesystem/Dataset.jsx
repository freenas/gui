// DATASET
// =======
// Display and edit constituent datset for a ZFS pool

"use strict";

import React from "react";

export default class Dataset extends React.Component {
  createChild ( dataset, index ) {
    return <Dataset key={ index } { ...dataset } />
  }

  render () {
    let classes = [ "dataset" ];
    const CHILDREN = this.props.children
                   ? this.props.children.map( this.createChild )
                   : null;

    if ( this.props.root ) {
      classes.push( "root" );
    }

    return (
      <div className={ classes.join( " " ) } >
        { this.props.name }
        { CHILDREN }
      </div>
    );
  }
}

Dataset.propTypes =
  { name             : React.PropTypes.string.isRequired
  , root             : React.PropTypes.bool
  , children         : React.PropTypes.array
  , pool             : React.PropTypes.string
  , permissions_type : React.PropTypes.oneOf([ "PERM", "ACL" ])
  , type             : React.PropTypes.oneOf([ "FILESYSTEM", "VOLUME" ])
  , share_type       : React.PropTypes.oneOf([ "UNIX", "MAC", "WINDOWS" ])
  , properties       : React.PropTypes.object // TODO: Get more specific
  };
