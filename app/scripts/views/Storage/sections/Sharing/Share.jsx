// SHARE
// =====
// Display and edit shares associated with a ZFS pool

"use strict";

import React from "react";
import { DropdownButton, MenuItem } from "react-bootstrap";

import ByteCalc from "../../../../utility/ByteCalc";

import Icon from "../../../../components/Icon";
import BreakdownChart from "../../common/BreakdownChart";
import ShareProperty from "./ShareProperty";
import ShareToggles from "./ShareToggles";
import ShareSettings from "./ShareSettings";
import NewShare from "./NewShare";

// STYLESHEET
if ( process.env.BROWSER ) require( "./Share.less" );


const SHARE_TYPES =
  { "CIFS" : "WINDOWS"
  , "AFP"  : "MAC"
  , "NFS"  : "UNIX"
  }

const LEFT_PADDING = 32;

export default class Share extends React.Component {
  toggleActive ( event ) {
    if ( event.currentTarget === event.target ) {
      event.stopPropagation();

      if ( this.isActive() ) {
        this.props.handlers.onDatasetInactive();
      } else {
        this.props.handlers.onDatasetActive( this.props.mountpoint );
      }
    }
  }

  isActive () {
    // TODO: smh tbh this is p dumb thx fam
    return this.props.activeDataset === this.props.mountpoint;
  }

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
      return;
    }

    const COMMON_PROPS =
      { pool     : this.props.pool
      , shares   : this.props.shares
      , handlers : this.props.handlers
      }

    if ( dataset.newDataset ) {
      return (
        <NewShare
          { ...dataset }
          { ...COMMON_PROPS }
          key = { index }
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
          { ...COMMON_PROPS }
          key           = { index }
          activeDataset = { this.props.activeDataset }
          updateDataset = { this.props.updateDataset }
          parentShared  = { parentShared }
          activeShare   = { activeShare }
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
    const { name, children, activeShare, parentShared, handlers, share_type
          , pool } = this.props;
    const { used, available, compression } = this.props.properties;

    let pathArray = name.split( "/" );

    const DATASET_NAME = pathArray.pop();
    const DATASET_DEPTH = pathArray.length;
    const PARENT_NAME = this.props.root
                      ? "Top Level"
                      : this.formatShareName( activeShare, parentShared );

    let paddingLeft = 0;
    let shiftLeft = 0;
    let classes = [ "dataset" ];
    let ShareToggles = null;

    if ( this.props.root ) {
      classes.push( "root" );
    } else {
      paddingLeft = LEFT_PADDING;
      shiftLeft   = LEFT_PADDING * DATASET_DEPTH;
      ShareToggles = (
        <ShareToggles
          parentShared  = { parentShared }
          activeShare   = { activeShare }
          onShareToggle = { this.handleShareToggle.bind( this ) }
        />
      );
    }

    return (
      <div
        className = { classes.join( " " ) }
        style     = {{ paddingLeft }}
      >

        {/* DATASET TOOLBAR */}
        <div
          className = "dataset-toolbar"
          onClick = { this.toggleActive.bind( this ) }
        >
          <ShareProperty
            legend    = { PARENT_NAME }
            className = "dataset-name"
          >
            { DATASET_NAME }
          </ShareProperty>

        {/* PROPERTIES OF DATASET AND OPTIONS */}
          <div className="dataset-properties">

            {/* RADIO TOGGLES FOR CREATING SHARES */}
            { ShareToggles }

            <ShareProperty legend="Compression">
              { compression.rawvalue }
            </ShareProperty>

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

          {/* BREAKDOWN */}
          <BreakdownChart
            used = { ByteCalc.convertString( used.rawvalue ) }
            free = { ByteCalc.convertString( available.rawvalue ) }
          />
        </div>

        {/* DATASET AND SHARE SETTINGS */}
        {/*
        <ShareSettings
          show        = { this.isActive() }
          pool        = { pool }
          shiftLeft   = { shiftLeft }
          handlers    = { handlers }
          name        = { name }
          activeShare = { activeShare }
          share_type = { share_type }
          updateDataset = { this.props.updateDataset }
        />
        */}

        {/* CHILD DATASETS */}
        <div className="dataset-children">
          { children.map( this.createChild.bind( this ) ) }
        </div>
      </div>
    );
  }
}

Share.propTypes =
  { name             : React.PropTypes.string.isRequired
  , mountpoint       : React.PropTypes.string.isRequired
  , pool             : React.PropTypes.string.isRequired
  , root             : React.PropTypes.bool
  , children         : React.PropTypes.array
  , permissions_type : React.PropTypes.oneOf([ "PERM", "ACL" ])
  , type             : React.PropTypes.oneOf([ "FILESYSTEM", "VOLUME" ])
  , share_type       : React.PropTypes.oneOf([ "UNIX", "MAC", "WINDOWS" ])
  , properties       : React.PropTypes.object // TODO: Get more specific

  // DATA
  , shares           : React.PropTypes.object

  // GUI META
  , activeShare      : React.PropTypes.object
  , parentShared     : React.PropTypes.string

  // HANDLERS
  , onUpdateShare : React.PropTypes.func.isRequired
  , onRevertShare : React.PropTypes.func.isRequired
  , onSubmitShare : React.PropTypes.func.isRequired
  , onRequestDeleteShare : React.PropTypes.func.isRequired
  };

Share.defaultProps =
  { name     : ""
  , children : []
  , properties:
    { used        : { rawvalue: 0 }
    , available   : { rawvalue: 0 }
    , compression : { rawvalue: "--" }
    }
  }
