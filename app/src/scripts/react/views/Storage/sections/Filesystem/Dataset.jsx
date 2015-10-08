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

const SHARE_TYPES =
  { "CIFS" : "WINDOWS"
  , "AFP"  : "MAC"
  , "NFS"  : "UNIX"
  }
export default class Dataset extends React.Component {
  handleShareToggle ( type ) {
    const { share_type, activeShare, handlers, name, mountpoint, pool }
      = this.props;

    if ( activeShare ) {
      if ( activeShare.type === type ) {
        // Early exit so that we don't do a whole ton of churn if the user
        // clicks on the toggle that's already selected.
        return;
      }

      // Delete the existing active share (this won't be triggered if 'off' is
      // clicked, so it's always safe)
      handlers.onShareDelete( activeShare.id );
    }

    if ( type !== "off" ) {
      // The user selected some share type that wasn't off, which means the
      // first task is converting the dataset to use the appropriate share_type
      let newShareType = SHARE_TYPES[ type.toUpperCase() ] || "UNIX";

      if ( newShareType !== share_type ) {
        // Of course, if the share_type is already correct, no need to update
        handlers.onDatasetUpdate( pool, name, { share_type: newShareType } );
      }

      // Finally, create the share
      handlers.onShareCreate(
        { id         : name.split( "/" ).pop()
        , type       : type
        , target     : mountpoint
        , properties : {} // FIXME: This needs to be filled out
        }
      );
    }
  }

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

  onDatasetDelete () {
    this.props.handlers.onDatasetDelete( this.props.pool, this.props.name );
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
      let activeShare, parentShared;

      if ( this.props.parentShared || this.props.activeShare ) {
        // If a parent dataset is shared, its children may not be shared, and
        // their primary sharing type must not be changed
        parentShared = this.props.parentShared || this.props.activeShare.type;
      } else if ( this.props.shares ) {
        activeShare = this.props.shares.get( dataset.mountpoint );
      }

      return (
        <Dataset
          { ...dataset }
          key          = { index }
          pool         = { this.props.pool }
          shares       = { this.props.shares }
          parentShared = { parentShared }
          activeShare  = { activeShare }
          handlers     = { this.props.handlers }
        />
      );
    }

    return null;
  }

  formatShareName ( activeShare, parentShared ) {
    let type;

    if ( activeShare ) {
      type = activeShare.type;
    } else if ( parentShared ) {
      type = parentShared;
    } else {
      type = "";
    }

    return type + " Share";
  }

  render () {
    const { name, children, activeShare, parentShared, handlers } = this.props;
    const { used, available, compression } = this.props.properties;

    const DATASET_NAME = name.split( "/" ).pop();
    const PARENT_NAME = this.props.root
                      ? "Top Level"
                      : this.formatShareName( activeShare, parentShared );

    let classes = [ "dataset" ];

    if ( this.props.root ) classes.push( "root" );

    return (
      <div className={ classes.join( " " ) }>

        {/* DATASET TOOLBAR */}
        <div className="dataset-toolbar">
          <DatasetProperty
            legend    = { PARENT_NAME }
            className = "dataset-name"
          >
            { DATASET_NAME }
          </DatasetProperty>

        {/* PROPERTIES OF DATASET AND OPTIONS */}
          <div className="dataset-properties">

            {/* RADIO TOGGLES FOR CREATING SHARES */}
            <DatasetShareToggles
              parentShared  = { parentShared }
              activeShare   = { activeShare }
              onShareToggle = { this.handleShareToggle.bind( this ) }
            />

            <DatasetProperty legend="Compression">
              { compression.rawvalue }
            </DatasetProperty>

            {/* "COG" DROPDOWN BUTTON: SHARE OPTIONS */}
            <DropdownButton
              noCaret
              pullRight
              bsStyle   = "link"
              className = "options"
              id        = { this.props.name.replace( /\s/, "-" ) + "-options-btn" }
              title     = { <Icon glyph="icon-cog" /> }
            >
              <MenuItem
                onSelect = { this.formatNewDataset.bind( this ) }
              >
                { "New share..." }
              </MenuItem>
              <MenuItem disabled>{ "New block storage..." }</MenuItem>

              <MenuItem divider />

              <MenuItem
                onSelect = { this.onDatasetDelete.bind( this ) }
              >
                { `Delete ${ DATASET_NAME }...` }
              </MenuItem>
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
  { name             : React.PropTypes.string.isRequired
  , mountpoint       : React.PropTypes.string.isRequired
  , pool             : React.PropTypes.string.isRequired
  , root             : React.PropTypes.bool
  , children         : React.PropTypes.array
  , permissions_type : React.PropTypes.oneOf([ "PERM", "ACL" ])
  , type             : React.PropTypes.oneOf([ "FILESYSTEM", "VOLUME" ])
  , share_type       : React.PropTypes.oneOf([ "UNIX", "MAC", "WINDOWS" ])
  , properties       : React.PropTypes.object // TODO: Get more specific
  , shares           : React.PropTypes.instanceOf( Map )
  , activeShare      : React.PropTypes.object
  , parentShared     : React.PropTypes.string
  , handlers : React.PropTypes.shape(
      { onShareCreate       : React.PropTypes.func.isRequired
      , onShareDelete       : React.PropTypes.func.isRequired
      , onDatasetChange     : React.PropTypes.func.isRequired
      , onDatasetUpdate     : React.PropTypes.func.isRequired
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
