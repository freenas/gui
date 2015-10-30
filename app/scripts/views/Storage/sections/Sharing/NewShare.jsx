// NEW SHARE
// ===========
// UI to be show during the creation of a new SHARE

"use strict";

import React from "react";
import { Input, Button, ButtonToolbar } from "react-bootstrap";

import ShareProperty from "./ShareProperty";
import ShareToggles from "./ShareToggles";

// TODO: Check potential names against blacklist

const NewShare = ( props ) => (
  <div
    className="dataset"
    style = {{ marginLeft: `${ props.depth * props.indent }px` }}
  >
    {/* DATASET TOOLBAR */}
    <div
      className = "dataset-toolbar"
      onClick = { () => props.onFocusShare( props.id ) }
    >
      <ShareProperty
        legend = "Share Name"
        className = "dataset-name"
      >
        <Input
          type = "text"
          placeholder = "New Share"
          onChange = { event =>
            props.onUpdateShare( props.id, { name: event.target.value } )
          }
          value = { props.name }
        />
      </ShareProperty>

      {/* RADIO TOGGLES FOR CREATING SHARES */}
      <ShareToggles
        parentShared  = { props.parentShared }
        type = { props.type }
        onUpdateShare = { props.onUpdateShare.bind( null, props.id ) }
      />

      <div className="dataset-properties">
        <ShareProperty>
          <ButtonToolbar>
            <Button
              bsStyle = "default"
              onClick  = { () => props.onRevertShare( props.id ) }
            >
              { "Cancel" }
            </Button>
            <Button
              bsStyle  = "primary"
              disabled = { props.name.length === 0 }
              onClick  = { () => props.onSubmitShare( props.id ) }
            >
              { "Submit" }
            </Button>
          </ButtonToolbar>
        </ShareProperty>
      </div>
    </div>
  </div>
);

NewShare.propTypes =
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
  , parentShared : React.PropTypes.bool
  , depth        : React.PropTypes.number.isRequired
  , indent       : React.PropTypes.number.isRequired

  // HANDLERS
  , onFocusShare         : React.PropTypes.func.isRequired
  , onBlurShare          : React.PropTypes.func.isRequired
  , onUpdateShare        : React.PropTypes.func.isRequired
  , onRevertShare        : React.PropTypes.func.isRequired
  , onSubmitShare        : React.PropTypes.func.isRequired
  };

export default NewShare;
