// DATASET PROPERTY
// ==================
// Display properties of the dataset in a similar format

"use strict";

import React from "react";
import { ButtonGroup, Button } from "react-bootstrap";

import DatasetProperty from "./DatasetProperty";


export default class DatasetShareToggles extends React.Component {
  render () {
    const { activeShare, onShareToggle } = this.props;

    return (
      <DatasetProperty legend="File Sharing">
        <ButtonGroup
          className = "btn-group-radio btn-group-radio-primary"
        >
          <Button
            active = { !activeShare }
            onClick = { onShareToggle.bind( this, "off" ) }
          >
            { "Off" }
          </Button>
          <Button
            active = { activeShare && activeShare.type === "nfs" }
            onClick = { onShareToggle.bind( this, "nfs" ) }
          >
            { "NFS" }
          </Button>
          <Button
            active = { activeShare && activeShare.type === "cifs" }
            onClick = { onShareToggle.bind( this, "cifs" ) }
          >
            { "CIFS" }
          </Button>
          <Button
            active = { activeShare && activeShare.type === "afp" }
            onClick = { onShareToggle.bind( this, "afp" ) }
          >
            { "AFP" }
          </Button>
        </ButtonGroup>
      </DatasetProperty>
    );
  }
}

DatasetShareToggles.propTypes =
  { onShareToggle : React.PropTypes.func.isRequired
  , activeShare   : React.PropTypes.object
  };
