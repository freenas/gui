// DATASET PROPERTY
// ==================
// Display properties of the dataset in a similar format

"use strict";

import React from "react";
import { ButtonGroup, Button } from "react-bootstrap";

import DatasetProperty from "./DatasetProperty";


export default class DatasetShareToggles extends React.Component {

  handleShareClick ( shareType ) {
    if ( this.props.disabled ) {
      return;
    } else {
      this.props.onShareToggle( shareType );
    }
  }

  render () {
    let classes = [ "btn-group-radio", "btn-group-radio-primary" ];
    const { activeShare, disabled } = this.props;

    if ( disabled ) classes.push( "disabled" );

    return (
      <DatasetProperty legend="File Sharing">
        <ButtonGroup
          className = { classes.join( " " ) }
        >
          <Button
            disabled  = { disabled }
            active    = { !activeShare }
            onClick   = { this.handleShareClick.bind( this, "off" ) }
          >
            { "Off" }
          </Button>
          <Button
            disabled  = { disabled }
            active    = { activeShare && activeShare.type === "nfs" }
            onClick   = { this.handleShareClick.bind( this, "nfs" ) }
          >
            { "NFS" }
          </Button>
          <Button
            disabled  = { disabled }
            active    = { activeShare && activeShare.type === "cifs" }
            onClick   = { this.handleShareClick.bind( this, "cifs" ) }
          >
            { "CIFS" }
          </Button>
          <Button
            disabled  = { disabled }
            active    = { activeShare && activeShare.type === "afp" }
            onClick   = { this.handleShareClick.bind( this, "afp" ) }
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
