// DATASET
// =======
// Display and edit constituent datset for a ZFS pool

"use strict";

import React from "react";
import { DropdownButton, MenuItem } from "react-bootstrap";

import ByteCalc from "../../../../../utility/ByteCalc";

import Icon from "../../../../components/Icon";
import BreakdownChart from "../../common/BreakdownChart";
import DatasetProperty from "./DatasetProperty";
import DatasetShareToggles from "./DatasetShareToggles";
import NewDataset from "./NewDataset";

// STYLESHEET
if ( process.env.BROWSER ) require( "./Dataset.less" );

export default class Dataset extends React.Component {
  formatNewDataset () {
    const NAME = "New Share";
    const newDataset =
      { pool_name  : this.props.pool
      , mountpoint : this.props.mountpoint + "/" + NAME
      , name       : this.props.name + "/" + NAME
      , type       : "FILESYSTEM"
      , newDataset : true
      };

    this.props.handlers.onDatasetChange( newDataset );
  }

  createChild ( dataset, index ) {
    if ( !dataset ) {
      console.warn( "No dataset was passed in" );
    }

    if ( dataset.newDataset ) {
      return (
        <NewDataset
          { ...dataset }
          key         = { index }
          pool        = { this.props.pool }
          handlers    = { this.props.handlers }
        />
      );
    } else if ( this.props.handlers.nameIsPermitted( dataset.name ) ) {
      const ACTIVE_SHARE = this.props.shares && dataset
                         ? this.props.shares.get( dataset.mountpoint )
                         : undefined;

      return (
        <Dataset
          { ...dataset }
          key         = { index }
          pool        = { this.props.pool }
          shares      = { this.props.shares }
          activeShare = { ACTIVE_SHARE }
          handlers    = { this.props.handlers }
        />
      );
    }

    return null;
  }

  render () {
    const { name, children, activeShare } = this.props;
    const { used, available, compression } = this.props.properties;

    const DATASET_NAME = name.split( "/" ).pop();
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

        {/* PROPERTIES OF DATASET AND OPTIONS */}
          <div className="dataset-properties">
            <DatasetProperty legend="Used">
              { ByteCalc.humanize( used.rawvalue ) }
            </DatasetProperty>

            <DatasetProperty legend="Available">
              { ByteCalc.humanize( available.rawvalue ) }
            </DatasetProperty>

            <DatasetProperty legend="Compression">
              { compression.rawvalue }
            </DatasetProperty>

            {/* RADIO TOGGLES FOR CREATING SHARES */}
            <DatasetShareToggles
              activeShare         = { activeShare }
              onShareCreate       = { this.props.handlers.onShareCreate }
              onShareDelete       = { this.props.handlers.onShareDelete }
              onSharingTypeChange = { this.props.handlers.onSharingTypeChange }
            />

            {/* "+" DROPDOWN BUTTON: ADD DATASETS AND ZVOLS */}
            <DropdownButton
              noCaret
              pullRight
              bsStyle   = "link"
              className = "add-child"
              id        = { this.props.name.replace( /\s/, "-" ) + "-add-btn" }
              title     = { <Icon glyph="icon-plus" /> }
            >
              <MenuItem
                onSelect = { this.formatNewDataset.bind( this ) }
              >
                { "Add Dataset..." }
              </MenuItem>
              <MenuItem disabled>{ "Add ZVOL..." }</MenuItem>
            </DropdownButton>
          </div>
        </div>

        {/* BREAKDOWN */}
        <BreakdownChart
          used = { ByteCalc.convertString( used.rawvalue ) }
          free = { ByteCalc.convertString( available.rawvalue ) }
        />

        {/* CHILD DATASETS */}
        <div className="dataset-children">
          { children.map( this.createChild.bind( this ) ) }
        </div>
      </div>
    );
  }
}

Dataset.propTypes =
  { name                : React.PropTypes.string.isRequired
  , mountpoint          : React.PropTypes.string.isRequired
  , pool                : React.PropTypes.string.isRequired
  , root                : React.PropTypes.bool
  , children            : React.PropTypes.array
  , permissions_type    : React.PropTypes.oneOf([ "PERM", "ACL" ])
  , type                : React.PropTypes.oneOf([ "FILESYSTEM", "VOLUME" ])
  , share_type          : React.PropTypes.oneOf([ "UNIX", "MAC", "WINDOWS" ])
  , properties          : React.PropTypes.object // TODO: Get more specific
  , shares              : React.PropTypes.instanceOf( Map )
  , activeShare         : React.PropTypes.object
  , disallowSharing     : React.PropTypes.bool // TODO: Not used... yet
  , parentIsShared      : React.PropTypes.bool // TODO: Not used... yet
  , handlers : React.PropTypes.shape(
      { onShareCreate       : React.PropTypes.func.isRequired
      , onShareDelete       : React.PropTypes.func.isRequired
      , onSharingTypeChange : React.PropTypes.func.isRequired
      , onDatasetChange     : React.PropTypes.func.isRequired
      , nameIsPermitted     : React.PropTypes.func.isRequired
      }
    ).isRequired
  };

Dataset.defaultProps =
  { name     : ""
  , children : []
  , properties:
    { used        : { rawvalue: 0 }
    , available   : { rawvalue: 0 }
    , compression : { rawvalue: "--" }
    }
  }
