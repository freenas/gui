// SHARING TOGGLES
// ==================
// Radio set for selecting share type

"use strict";

import React from "react";
import { ButtonGroup, Button } from "react-bootstrap";

import ShareProperty from "./ShareProperty";


export default class ShareToggles extends React.Component {

  handleShareClick ( shareType ) {
    if ( this.props.disabled ) {
      return;
    } else {
      this.props.onShareToggle( shareType );
    }
  }

  render () {
    const { activeShare, parentShared } = this.props;
    let classes = [ "btn-group-radio", "btn-group-radio-primary" ];
    let activeType, disabled;

    if ( parentShared ) {
      classes.push( "disabled" );
      disabled = true;
      activeType = parentShared;
    } else {
      activeType = activeShare
                 ? activeShare.type
                 : "off";
    }

    return (
      <ShareProperty legend="Share Type">
        <ButtonGroup
          className = { classes.join( " " ) }
        >
          <Button
            disabled  = { disabled }
            active    = { activeType === "off" }
            onClick   = { this.handleShareClick.bind( this, "off" ) }
          >
            { "Off" }
          </Button>
          <Button
            disabled  = { disabled }
            active    = { activeType === "nfs" }
            onClick   = { this.handleShareClick.bind( this, "nfs" ) }
          >
            { "NFS" }
          </Button>
          <Button
            disabled  = { disabled }
            active    = { activeType === "cifs" }
            onClick   = { this.handleShareClick.bind( this, "cifs" ) }
          >
            { "CIFS" }
          </Button>
          <Button
            disabled  = { disabled }
            active    = { activeType === "afp" }
            onClick   = { this.handleShareClick.bind( this, "afp" ) }
          >
            { "AFP" }
          </Button>
        </ButtonGroup>
      </ShareProperty>
    );
  }
}

ShareToggles.propTypes =
  { onShareToggle : React.PropTypes.func.isRequired
  , parentShared  : React.PropTypes.string
  , activeShare   : React.PropTypes.object
  };
