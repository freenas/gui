// DATASET
// =======
// Display and edit constituent datset for a ZFS pool

"use strict";

import React from "react";

import BC from "../../../../../utility/ByteCalc";
import BreakdownChart from "../../common/BreakdownChart";

// STYLESHEET
if ( process.env.BROWSER ) require( "./Dataset.less" );

export default class Dataset extends React.Component {
  createProperty ( legend, content ) {
    return (
      <div className="dataset-property">
        <span className="property-legend">{ legend }</span>
        <span className="property-content">{ content }</span>
      </div>
    );
  }

  createChild ( dataset, index ) {
    return <Dataset key={ index } { ...dataset } />
  }

  render () {
    let classes = [ "dataset" ];

    const { used, available, compression } = this.props.properties;
    const CHILDREN = this.props.children
                   ? this.props.children.map( this.createChild )
                   : null;

    if ( this.props.root ) classes.push( "root" );

    return (
      <div className={ classes.join( " " ) } >

        {/* DATASET TOOLBAR */}
        <div className="dataset-toolbar">
          <div className="dataset-property dataset-name">
            <span className="property-legend">{"ZFS Dataset"}</span>
            <span className="property-content">{ this.props.name }</span>
          </div>

          <div className="dataset-properties">
            { this.createProperty( "Used", BC.humanize( used.rawvalue ) ) }
            { this.createProperty( "Available", BC.humanize( available.rawvalue ) ) }
            { this.createProperty( "Compression", compression.rawvalue ) }
          </div>
        </div>

        {/* BREAKDOWN */}
        <BreakdownChart
          used = { BC.convertString( used.rawvalue ) }
          free = { BC.convertString( available.rawvalue ) }
        />

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

Dataset.defaultProps =
  { name: ""
  , properties:
    { used      : { rawvalue: 0 }
    , available : { rawvalue: 0 }
    }
  }
