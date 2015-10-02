// DATASET PROPERTY
// ==================
// Display properties of the dataset in a similar format

"use strict";

import React from "react";
import { ButtonGroup, Button } from "react-bootstrap";

import DatasetProperty from "./DatasetProperty";

export default class DatasetShareToggles extends React.Component {
  handleShareToggle ( type ) {
    if ( this.props.activeShare ) {
      this.props.handlers.onShareDelete();
    }

    if ( type !== "off" ) {
      this.props.handlers.onSharingTypeChange();
      this.props.handlers.onShareCreate();
    }
  }

  render () {
    const { activeShare } = this.props;

    return (
      <DatasetProperty legend="File Sharing">
        <ButtonGroup
          className = "btn-group-radio btn-group-radio-primary"
        >
          <Button
            active = { !activeShare }
            onClick = { this.handleShareToggle.bind( this, "off" ) }
          >
            { "Off" }
          </Button>
          <Button
            active = { activeShare && activeShare.type === "nfs" }
            onClick = { this.handleShareToggle.bind( this, "nfs" ) }
          >
            { "NFS" }
          </Button>
          <Button
            active = { activeShare && activeShare.type === "cifs" }
            onClick = { this.handleShareToggle.bind( this, "cifs" ) }
          >
            { "CIFS" }
          </Button>
          <Button
            active = { activeShare && activeShare.type === "afp" }
            onClick = { this.handleShareToggle.bind( this, "afp" ) }
          >
            { "AFP" }
          </Button>
        </ButtonGroup>
      </DatasetProperty>
    );
  }
}

DatasetShareToggles.propTypes =
  { onShareCreate       : React.PropTypes.func.isRequired
  , onShareDelete       : React.PropTypes.func.isRequired
  , onSharingTypeChange : React.PropTypes.func.isRequired
  , activeShare         : React.PropTypes.object
  };
