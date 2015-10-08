// DATASET SETTINGS
// ================
// Display the available settings for a dataset

"use strict";

import React from "react";
import { Button, ButtonToolbar, Input } from "react-bootstrap";

// TODO: Find a better way to source this
const CONTAINER_PADDING = 15;

export default class DatasetSettings extends React.Component {
  render () {
    return (
      <div
        className = "dataset-settings"
        style     = {{ marginLeft: -this.props.shiftLeft - CONTAINER_PADDING }}
      >
        <span
          className = "pointer"
          style     = {{ left: this.props.shiftLeft }}
        />


        <section className="form-section">
          <form className="form-horizontal">
            <Input
              type = "text"
              label = "Share Name"
              labelClassName = "col-xs-2"
              wrapperClassName = "col-xs-10"
            />
            <Input
              type = "text"
              label = "Export Share As"
              labelClassName = "col-xs-2"
              wrapperClassName = "col-xs-10"
            />
            <Input
              type = "checkbox"
              label = "Allow Guest Access"
              wrapperClassName = "col-xs-offset-2 col-xs-10"
            />
          </form>
        </section>

        <div className="form-handlers">
          <ButtonToolbar>
            <Button
              bsStyle = "default"
              bsSize  = "small"
            >
              { "Revert" }
            </Button>
            <Button
              bsStyle = "primary"
              bsSize  = "small"
            >
              { "Submit" }
            </Button>
          </ButtonToolbar>
        </div>
      </div>
    );
  }
}
