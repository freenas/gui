// DATASET
// =======
// Display and edit constituent datset for a ZFS pool

"use strict";

import React from "react";
import { Button, ButtonToolbar } from "react-bootstrap";

import ByteCalc from "../../../../../utility/ByteCalc";

import Icon from "../../../../components/Icon";
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
    return (
      <Dataset { ...dataset } key = { index } />
    );
  }

  render () {
    const { name, children } = this.props;
    const { used, available, compression } = this.props.properties;
    const CHILDREN = children
                   ? children.map( this.createChild.bind( this ) )
                   : null;
    let pathArray = name.split( "/" );
    const DATASET_NAME = pathArray.pop();
    const PARENT_NAME = this.props.root
                      ? "Top Level"
                      : "ZFS Dataset";

    let classes = [ "dataset" ];

    if ( this.props.root ) classes.push( "root" );

    return (
      <div className={ classes.join( " " ) }>

        {/* DATASET TOOLBAR */}
        <div className="dataset-toolbar">
          <div className="dataset-property dataset-name">
            <span className="property-legend">
              { PARENT_NAME }
            </span>
            <span className="property-content">
              { DATASET_NAME }
            </span>
          </div>

          <div className="dataset-properties">
            { this.createProperty( "Used", ByteCalc.humanize( used.rawvalue ) ) }
            { this.createProperty( "Available", ByteCalc.humanize( available.rawvalue ) ) }
            { this.createProperty( "Compression", compression.rawvalue ) }
            <Button className="btn-gradient add-child">
              <Icon glyph="icon-plus" />
            </Button>
          </div>
        </div>

        {/* BREAKDOWN */}
        <BreakdownChart
          used = { ByteCalc.convertString( used.rawvalue ) }
          free = { ByteCalc.convertString( available.rawvalue ) }
        />

        {/* CHILD DATASETS */}
        <div className="dataset-children">
          { CHILDREN }
        </div>
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
