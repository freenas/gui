// SHARING TOGGLES
// ==================
// Radio set for selecting share type

"use strict";

import React from "react";
import { ButtonGroup, Button } from "react-bootstrap";

import ShareProperty from "./ShareProperty";


const ShareToggles = ( props ) => {
  let classes = [ "btn-group-radio", "btn-group-radio-primary" ];
  let activeType;
  let disabled;

  if ( props.parentShared ) {
    classes.push( "disabled" );
    disabled = true;
    activeType = props.parentShared;
  } else {
    activeType = props.type;
  }

  return (
    <span>
      <ShareProperty legend="File Sharing">
        <ButtonGroup
          className = { classes.join( " " ) }
        >
          <Button
            disabled  = { disabled }
            active    = { activeType === "nfs" }
            onClick   = { () =>
              { disabled
              ? null
              : props.onUpdateShare({ type: "nfs" })
              }
            }
          >
            { "NFS" }
          </Button>
          <Button
            disabled  = { disabled }
            active    = { activeType === "cifs" }
            onClick   = { () =>
              { disabled
              ? null
              : props.onUpdateShare({ type: "cifs" })
              }
            }
          >
            { "SMB" }
          </Button>
          <Button
            disabled  = { disabled }
            active    = { activeType === "afp" }
            onClick   = { () =>
              { disabled
              ? null
              : props.onUpdateShare({ type: "afp" })
              }
            }
          >
            { "AFP" }
          </Button>
        </ButtonGroup>
      </ShareProperty>

      <ShareProperty legend="Block Storage">
        <ButtonGroup
          className = { classes.join( " " ) }
        >
          <Button
            disabled  = { disabled }
            active    = { activeType === "iscsi" }
            onClick   = { () =>
              { disabled
              ? null
              : props.onUpdateShare({ type: "iscsi" })
              }
            }
          >
            { "iSCSI" }
          </Button>
        </ButtonGroup>
      </ShareProperty>
    </span>
  );
}

ShareToggles.propTypes =
  { onUpdateShare : React.PropTypes.func.isRequired
  , parentShared  : React.PropTypes.string
  , type : React.PropTypes.string
  };

export default ShareToggles;
