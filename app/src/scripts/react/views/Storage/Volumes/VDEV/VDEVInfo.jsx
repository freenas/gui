// VDEV INFO
// =========
// Displays the type of a VDEV, with built-in controls for selecting different
// types.

"use strict";

import React from "react";
import TWBS from "react-bootstrap";

const HUMAN_TYPES =
  { disk   : "Disk"
  , mirror : "Mirror"
  , raidz1 : "RAID-Z1"
  , raidz2 : "RAID-Z2"
  , raidz3 : "RAID-Z3"
  };

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

  , createMenuItems ( type, index ) {
      return (
        <TWBS.MenuItem
          key = { index }
        >
          { HUMAN_TYPES[ type ] }
        </TWBS.MenuItem>
      );
    }

  , render () {
      let typeButton;
      let typeName = HUMAN_TYPES[ this.props.type ] || "Empty";

      if ( this.props.allowedTypes.length > 1 ) {
        typeButton = (
          <TWBS.DropdownButton
            buttonClassName = "vdev-type"
            title = { typeName }
          >
            { this.props.allowedTypes.map( this.createMenuItems ) }
          </TWBS.DropdownButton>
        );
      } else {
        typeButton = (
          <TWBS.Button
            disabled
            className = "vdev-type"
          >
            { typeName }
          </TWBS.Button>
        );

      }
      return (
        <div className="toolbar">
          { typeButton }
        </div>
      );
    }
  }
);

export default VDEVInfo;
