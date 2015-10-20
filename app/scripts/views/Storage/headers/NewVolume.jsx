// NEW VOLUME FORM
// ===============
// Different content to be shown in the Volume header when the Volume is being
// created for the first time.

"use strict";

import React from "react";
import { Button, ButtonToolbar, Input } from "react-bootstrap";

import BreakdownChart from "../common/BreakdownChart";

export default class NewVolume extends React.Component {
  render () {
    return (
      <div className="volume-info">
        <div className="clearfix">

          {/* VOLUME NAME INPUT */}
          <div className="volume-name-input">
            <Input
              autoFocus
              type        = "text"
              placeholder = "Volume Name"
              onClick     = { event => event.stopPropagation() }
              onChange    = { this.props.onVolumeNameChange }
              className   = "form-overlay"
              value       = { this.props.volumeName }
            />
          </div>

          {/* CANCEL AND SUBMIT BUTTONS */}
          <ButtonToolbar className="pull-right">
            <Button
              bsStyle = "default"
              onClick = { this.props.onCancelClick }
            >
              { "Cancel" }
            </Button>
            {/* TODO: Logic for allowing submission should be more complex */}
            <Button
              bsStyle  = "primary"
              disabled = { this.props.disableSubmit || this.props.volumeName.length < 1 }
              onClick  = { this.props.onSubmitClick }
            >
              { "Submit" }
            </Button>
          </ButtonToolbar>
        </div>

        {/* TOPOLOGY BREAKDOWN */}
        <BreakdownChart
          parity = { this.props.topologyBreakdown.parity }
          used   = { 0 }
          free   = { this.props.topologyBreakdown.avail }
        />
      </div>
    );
  }
}

NewVolume.propTypes =
  { onVolumeNameChange : React.PropTypes.func.isRequired
  , disableSubmit      : React.PropTypes.bool
  , onSubmitClick      : React.PropTypes.func.isRequired
  , onCancelClick      : React.PropTypes.func.isRequired
  , volumeName         : React.PropTypes.string.isRequired
  , topologyBreakdown  : React.PropTypes.shape(
      { parity : React.PropTypes.number.isRequired
      , avail  : React.PropTypes.number.isRequired
      }
    )
  };
