// SHARE
// =====
// Display and edit shares associated with a ZFS pool

"use strict";

import React from "react";
import { Button, MenuItem } from "react-bootstrap";

import ByteCalc from "../../../../utility/ByteCalc";

import Icon from "../../../../components/Icon";
import BreakdownChart from "../../common/BreakdownChart";
import ShareProperty from "./ShareProperty";
import ShareToggles from "./ShareToggles";
import ShareSettings from "./ShareSettings";
import NewShare from "./NewShare";


// STYLESHEET
if ( process.env.BROWSER ) require( "./Share.less" );


// REACT
export default class Share extends React.Component {

  renderChild ( id, index ) {
    const ON_SERVER = this.props.shares.serverShares[ id ];
    const ON_CLIENT = this.props.shares.clientShares[ id ];

    const SHARE = Object.assign( {}, ON_SERVER, ON_CLIENT );

    // HANDLERS
    const COMMON_PROPS =
      { depth  : this.props.depth + 1
      , indent : this.props.indent

      , onFocusShare  : this.props.onFocusShare
      , onBlurShare   : this.props.onBlurShare

      , onUpdateShare : this.props.onUpdateShare
      , onRevertShare : this.props.onRevertShare
      , onSubmitShare : this.props.onSubmitShare
      };

    if ( Boolean( ON_SERVER ) ) {
      // If a parent dataset is shared, its children may not be shared, and
      // their primary sharing type must not be changed
      return (
        <Share
          { ...SHARE }
          { ...COMMON_PROPS }
          key = { index }
          shares = { this.props.shares }
          parentShared = { this.props.enabled ? this.props.type : "" }
          activeShare = { this.props.activeShare }
          childShares = { this.props.childShares }
          children = { this.props.childShares[ SHARE.id ] }
          onRequestDeleteShare = { this.props.onRequestDeleteShare }
        />
      );
    } else if ( Boolean( ON_CLIENT ) ) {
      return (
        <NewShare
          { ...SHARE }
          { ...COMMON_PROPS }
          key = { index }
        />
      );
    } else {
      console.warn( `The share "${ id }" does not seem to exist` );
      return;
    }
  }

  render () {
    const { used, available, compression } = this.props.datasetProperties;

    let nameLegend;
    let classes = [ "dataset" ];
    let toggles;

    if ( this.props.isRoot ) {
      nameLegend = "Top Level";
      classes.push( "root" );
      toggles = null;
    } else {
      nameLegend = `${ this.props.type } Share`;
      toggles = (
        <ShareToggles
          parentShared  = { this.props.parentShared }
          onUpdateShare = { this.props.onUpdateShare.bind( null, this.props.id ) }
        />
      );
    }

    return (
      <div
        className = { classes.join( " " ) }
        style = { ( this.props.depth > 0 )
                ? { paddingLeft: `${ this.props.indent }px` }
                : {}
                }
      >

        {/* DATASET TOOLBAR */}
        <div
          className = "dataset-toolbar"
          onClick = { () => this.props.onFocusShare( this.props.id ) }
        >
          <ShareProperty
            legend    = { nameLegend }
            className = "dataset-name"
          >
            { this.props.name }
          </ShareProperty>

        {/* PROPERTIES OF DATASET AND OPTIONS */}
          <div className="dataset-properties">

            {/* RADIO TOGGLES FOR CREATING SHARES */}

            <ShareProperty legend="Compression">
              { compression.rawvalue }
            </ShareProperty>

            <Button
              noCaret
              pullRight
              bsStyle   = "link"
              className = "add"
              onClick = { () =>
                this.props.onUpdateShare( "NEW"
                                        , { target: this.props.target }
                                        )
              }
            >
              {"+"}
            </Button>
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
          { this.props.children.map( this.renderChild.bind( this ) ) }
        </div>
      </div>
    );
  }
}

Share.propTypes =
  // DATA FROM MIDDLEWARE
  { properties      : React.PropTypes.object.isRequired
  , name            : React.PropTypes.string.isRequired
  , target          : React.PropTypes.string.isRequired
  , type            : React.PropTypes.string.isRequired
  , filesystem_path : React.PropTypes.string
  , enabled         : React.PropTypes.bool
  , id              : React.PropTypes.string.isRequired
  , dataset_path    : React.PropTypes.string
  , description     : React.PropTypes.string

  // DATA
  , children    : React.PropTypes.array
  , childShares : React.PropTypes.object
  , shares      : React.PropTypes.object
  , isRoot      : React.PropTypes.bool

  // GUI META
  , activeShare  : React.PropTypes.string
  , parentShared : React.PropTypes.string
  , depth        : React.PropTypes.number.isRequired
  , indent       : React.PropTypes.number.isRequired

  // HANDLERS
  , onFocusShare         : React.PropTypes.func.isRequired
  , onBlurShare          : React.PropTypes.func.isRequired
  , onUpdateShare        : React.PropTypes.func.isRequired
  , onRevertShare        : React.PropTypes.func.isRequired
  , onSubmitShare        : React.PropTypes.func.isRequired
  , onRequestDeleteShare : React.PropTypes.func.isRequired
  };

Share.defaultProps =
  { children : []
  , datasetProperties:
    { used        : { rawvalue: 0 }
    , available   : { rawvalue: 0 }
    , compression : { rawvalue: "--" }
    }
  }
