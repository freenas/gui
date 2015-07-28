// VDEV INFO
// =========
// Displays the type of a VDEV, with built-in controls for selecting different
// types.

"use strict";

import React from "react";
import TWBS from "react-bootstrap";

const VDEVInfo = React.createClass(
  { propTypes:
    { handleTypeChange: React.PropTypes.func.isRequired
    , type: React.PropTypes.oneOf(
        [ null
        , "disk"
        , "mirror"
        , "raidz1"
        , "raidz2"
        , "raidz3"
        ]
      )
    , allowedTypes: React.PropTypes.array.isRequired
    }

  , createMenuItems ( type ) {
      return <TWBS.MenuItem>{ type }</TWBS.MenuItem>;
    }

  , render () {
      let typeButton;

      if ( this.props.allowedTypes.length > 1 ) {
        typeButton = (
          <TWBS.DropdownButton
            title = { this.props.type || "Empty" }
          >
            { this.props.allowedTypes.map( this.createMenuItems ) }
          </TWBS.DropdownButton>
        );
      } else {
        typeButton = (
          <span>
            { this.props.type || "Empty" }
          </span>
        );

      }
      return (
        <div>
          { typeButton }
        </div>
      );
    }
  }
);

export default VDEVInfo;
