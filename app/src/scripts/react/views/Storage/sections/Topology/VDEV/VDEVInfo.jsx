// VDEV INFO
// =========
// Displays the type of a VDEV, with built-in controls for selecting different
// types.

"use strict";

import React from "react";
import { MenuItem, DropdownButton, Button } from "react-bootstrap";

import Icon from "../../../../../components/Icon";

const HUMAN_TYPES =
  { disk   : "Disk"
  , stripe : "Stripe"
  , mirror : "Mirror"
  , raidz1 : "RAID-Z1"
  , raidz2 : "RAID-Z2"
  , raidz3 : "RAID-Z3"
  };

const VDEVInfo = React.createClass(
  { propTypes:
    { onTypeChange: React.PropTypes.func.isRequired
    , onVdevNuke: React.PropTypes.func.isRequired
    , type: React.PropTypes.oneOf(
        [ null
        , "disk"
        , "stripe"
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
        <MenuItem
          key = { index }
          onSelect = { this.props.onTypeChange.bind( null, type ) }
        >
          { HUMAN_TYPES[ type ] }
        </MenuItem>
      );
    }

  , render () {
      let typeButton;
      let closeButton;
      let typeName = HUMAN_TYPES[ this.props.type ] || "Empty";

      if ( this.props.allowedTypes.length > 1 ) {
        typeButton = (
          <DropdownButton
            buttonClassName = "vdev-type"
            title = { typeName }
          >
            { this.props.allowedTypes.map( this.createMenuItems ) }
          </DropdownButton>
        );
      } else {
        typeButton = (
          <Button
            disabled
            className = "vdev-type"
          >
            { typeName }
          </Button>
        );

      }

      if ( typeName !== "Empty" ) {
        closeButton = (
          <span
            className = "vdev-remove"
            onClick = { this.props.onVdevNuke }
          />
        );
      }

      return (
        <div className="toolbar">
          { typeButton }
          { closeButton }
          { this.props.children }
        </div>
      );
    }
  }
);

export default VDEVInfo;
