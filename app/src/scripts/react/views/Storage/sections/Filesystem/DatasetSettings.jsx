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
    const { show, activeShare } = this.props;

    let display = show
                ? null
                : "none";

    let exportName;
    let noActiveShare;

    if ( activeShare ) {
      exportName = activeShare.id;
      noActiveShare = false;
    } else {
      noActiveShare = true;
    }

    return (
      <div
        className = "dataset-settings"
        style = {
          { marginLeft: -this.props.shiftLeft - CONTAINER_PADDING
          , display
          }
        }
      >
        <span
          className = "pointer"
          style     = {{ left: this.props.shiftLeft }}
        />


        <section className="form-section">
          <form className="form-horizontal">
            <Input
              type = "text"
              label = "Name"
              value = { this.props.name }
              labelClassName = "col-xs-2"
              wrapperClassName = "col-xs-10"
            />
            <Input
              disabled = { noActiveShare }
              type = "text"
              label = "Export As"
              value = { exportName }
              labelClassName = "col-xs-2"
              wrapperClassName = "col-xs-10"
            />
            <Input
              disabled
              type = "checkbox"
              label = "Allow Guest Access"
              wrapperClassName = "col-xs-offset-2 col-xs-10"
              help = "Coming soon!"
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

DatasetSettings.propTypes =
  { name        : React.PropTypes.string.isRequired
  , show        : React.PropTypes.bool
  , shiftLeft   : React.PropTypes.number.isRequired
  , share_type  : React.PropTypes.oneOf([ "UNIX", "MAC", "WINDOWS" ])
  , activeShare : React.PropTypes.object
  , handlers : React.PropTypes.shape(
      { onShareCreate     : React.PropTypes.func.isRequired
      , onShareDelete     : React.PropTypes.func.isRequired
      , onDatasetActive   : React.PropTypes.func.isRequired
      , onDatasetInactive : React.PropTypes.func.isRequired
      , onDatasetChange   : React.PropTypes.func.isRequired
      , onDatasetUpdate   : React.PropTypes.func.isRequired
      , nameIsPermitted   : React.PropTypes.func.isRequired
      }
    ).isRequired
  };
