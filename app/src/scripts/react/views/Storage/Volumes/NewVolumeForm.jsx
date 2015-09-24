// NEW VOLUME FORM
// ===============
// Different content to be shown in the Volume header when the Volume is being
// created for the first time.

"use strict";

import React from "react";
import { Button, ButtonToolbar, Input } from "react-bootstrap";

import ByteCalc from "../../../../utility/ByteCalc";

import BreakdownChart from "./BreakdownChart";

export default class NewVolumeForm extends React.Component {
  componentDidMount () {
    React.findDOMNode( this.refs.volumeNameInput )
         .getElementsByTagName( "INPUT" )[0]
         .focus();
  }

  render () {
    return (
      <div className="volume-info">
        <div className="clearfix">

          {/* VOLUME NAME INPUT */}
          <div className="volume-name-input">
            <Input
              ref         = "volumeNameInput"
              type        = "text"
              placeholder = "Volume Name"
              onClick     = { event => event.stopPropagation() }
              onChange    = { this.props.onVolumeNameChange }
              className   = "form-overlay"
              value       = { this.props.volumeName }
            />
          </div>
          <h3 className="pull-right volume-capacity">
            { ByteCalc.humanize( this.props.topologyBreakdown.avail ) }
          </h3>

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
              disabled = { this.props.volumeName.length < 1 }
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

NewVolumeForm.propTypes =
  { onVolumeNameChange : React.PropTypes.func.isRequired
  , onSubmitClick      : React.PropTypes.func.isRequired
  , onCancelClick      : React.PropTypes.func.isRequired
  , volumeName         : React.PropTypes.string.isRequired
  , topologyBreakdown  : React.PropTypes.shape(
      { parity : React.PropTypes.number.isRequired
      , avail  : React.PropTypes.number.isRequired
      }
    )
  };
