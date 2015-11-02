// NEW VOLUME FORM
// ===============
// Different content to be shown in the Volume header when the Volume is being
// created for the first time.

"use strict";

import React from "react";
import { Button, ButtonToolbar, Input, DropdownButton, MenuItem }
  from "react-bootstrap";

import ByteCalc from "../../utility/ByteCalc";
import Throbber from "../../components/Throbber";
import Icon from "../../components/Icon";
import BreakdownChart from "./common/BreakdownChart";

const VolumeHeader = ( props ) => {
  const IS_SUBMITTING = props.volumeState === "SUBMITTING";
  const DISABLE_SUBMIT =
    ( IS_SUBMITTING || props.disableSubmit );
  const SHOW_EDIT =
    ( props.volumeState === "NEW_ON_CLIENT" || props.volumeState === "SUBMITTING" );

  return (
    <div className="volume-info" onClick={ props.onClick }>
      <div className="clearfix">

        { SHOW_EDIT ? (
          <div className="volume-name-input">
            {/* VOLUME NAME INPUT */}
            <Input
              autoFocus
              type        = "text"
              placeholder = "Volume Name"
              readOnly    = { IS_SUBMITTING }
              onClick     = { event => event.stopPropagation() }
              onChange    = { event =>
                props.onVolumeNameChange( event.target.value )
              }
              className   = "form-overlay"
              value       = { props.volumeName }
            />
          </div>
        ) : (
          <h3 className="pull-left volume-name">
          {/* POOL NAME AND HEALTH INDICATOR */}
            { props.volumeName }
          </h3>
        ) }


        { SHOW_EDIT ? (
          <ButtonToolbar className="pull-right">
            {/* CANCEL AND SUBMIT BUTTONS */}
            <Button
              bsStyle = "default"
              onClick = { props.onCancelClick }
              disabled = { IS_SUBMITTING }
            >
              { "Cancel" }
            </Button>
            {/* TODO: Logic for allowing submission should be more complex */}
            <Button
              bsStyle  = "primary"
              disabled = { DISABLE_SUBMIT }
              onClick  = { props.onSubmitClick }
            >
              { "Submit" }
            </Button>
          </ButtonToolbar>
        ) : (
          <div className = "pull-right">
            {/* TOTAL CAPACITY */}
            <h3 className="volume-capacity">
              { ByteCalc.humanize( props.topologyBreakdown.avail ) }
            </h3>

            {/* VOLUME OPTIONS */}
            <div
              className = "volume-options-dropdown"
              onClick = { ( event ) => { event.stopPropagation(); } }
            >
              <DropdownButton
                noCaret
                pullRight
                id      = { "volume-options-" + props.volumeName }
                bsStyle = "link"
                title   = { <Icon glyph="icon-cog" /> }
              >
                <MenuItem
                  eventKey = { 1 }
                  onSelect = { props.onDestroyPool }
                >
                  { "Destroy " + props.volumeName + "..." }
                </MenuItem>
              </DropdownButton>
            </div>
          </div>
        ) }
      </div>

      {/* TOPOLOGY BREAKDOWN */}
      <BreakdownChart
        parity = { props.topologyBreakdown.parity }
        used   = { props.topologyBreakdown.used }
        free   = { props.topologyBreakdown.avail }
      />
    </div>
  );
}

VolumeHeader.propTypes =
  { volumeName         : React.PropTypes.string.isRequired
  , disableSubmit      : React.PropTypes.bool
  , volumeState: React.PropTypes.oneOf(
      [ "NEW_ON_CLIENT"
      , "SUBMITTING"
      , "CREATING"
      , "DELETING"
      ]
    )
  , topologyBreakdown  : React.PropTypes.shape(
      { parity : React.PropTypes.number.isRequired
      , avail  : React.PropTypes.number.isRequired
      , free   : React.PropTypes.number
      }
    )
  , onClick            : React.PropTypes.func.isRequired
  , onVolumeNameChange : React.PropTypes.func.isRequired
  , onCancelClick      : React.PropTypes.func.isRequired
  , onSubmitClick      : React.PropTypes.func.isRequired
  , onDestroyPool      : React.PropTypes.func.isRequired
  };

VolumeHeader.defaultProps =
  { volumeName: ""
  , topologyBreakdown:
    { parity : 0
    , avail  : 0
    , free   : 0
    }
  };

export default VolumeHeader;
