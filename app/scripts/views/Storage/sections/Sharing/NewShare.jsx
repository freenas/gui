// NEW SHARE
// ===========
// UI to be show during the creation of a new SHARE

"use strict";

import React from "react";
import { Input, Button, ButtonToolbar } from "react-bootstrap";

import ShareProperty from "./ShareProperty";

// TODO: Check potential names against blacklist

export default class NewShare extends React.Component {
  handleNameChange ( event ) {
    const NAME = event.target.value;

    const normalizedName =
      { name: this.props.name.replace( /([^\/]*$)/i, NAME )
      };

    this.props.handlers.onDatasetChange( normalizedName );
  }

  handleCreateDataset ( event ) {
    this.props.handlers.onDatasetCreate( this.props.pool
                                       , this.props.name
                                       , this.props.type
                                       );
    this.props.handlers.onDatasetCancel();
  }

  render () {
    const NAME = this.props.name.split( "/" ).pop();

    return (
      <div className="dataset">
        {/* DATASET TOOLBAR */}
        <div className="dataset-toolbar">
          <ShareProperty
            legend    = "Share Name"
            className = "dataset-name"
          >
            <Input
              type     = "text"
              onChange = { this.handleNameChange.bind( this ) }
              value    = { NAME }
            />
          </ShareProperty>

          <div className="dataset-properties">
            <ShareProperty>
              <ButtonToolbar>
                <Button
                  bsStyle = "default"
                  onClick  = { this.props.handlers.onDatasetCancel }
                >
                  { "Cancel" }
                </Button>
                <Button
                  bsStyle  = "primary"
                  disabled = { NAME.length === 0 }
                  onClick  = { this.handleCreateDataset.bind( this ) }
                >
                  { "Submit" }
                </Button>
              </ButtonToolbar>
            </ShareProperty>
          </div>
        </div>
      </div>
    );
  }
}

NewShare.propTypes =
  { name             : React.PropTypes.string.isRequired
  , mountpoint       : React.PropTypes.string
  , pool             : React.PropTypes.string.isRequired
  , root             : React.PropTypes.bool
  , children         : React.PropTypes.array
  , permissions_type : React.PropTypes.oneOf([ "PERM", "ACL" ])
  , type             : React.PropTypes.oneOf([ "FILESYSTEM", "VOLUME" ]).isRequired
  , share_type       : React.PropTypes.oneOf([ "UNIX", "MAC", "WINDOWS" ])
  , properties       : React.PropTypes.object // TODO: Get more specific
  , handlers : React.PropTypes.shape(
      { onDatasetChange : React.PropTypes.func.isRequired
      , onDatasetCreate : React.PropTypes.func.isRequired
      , onDatasetCancel : React.PropTypes.func.isRequired
      , nameIsPermitted : React.PropTypes.func.isRequired
      }
    ).isRequired
  };
