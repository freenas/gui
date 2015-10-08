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
    let display = this.props.show
                ? null
                : "none";

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

DatasetSettings.propTypes =
  { name             : React.PropTypes.string.isRequired
  , mountpoint       : React.PropTypes.string.isRequired
  , pool             : React.PropTypes.string.isRequired
  , root             : React.PropTypes.bool
  , children         : React.PropTypes.array
  , permissions_type : React.PropTypes.oneOf([ "PERM", "ACL" ])
  , type             : React.PropTypes.oneOf([ "FILESYSTEM", "VOLUME" ])
  , share_type       : React.PropTypes.oneOf([ "UNIX", "MAC", "WINDOWS" ])
  , properties       : React.PropTypes.object // TODO: Get more specific
  , shares           : React.PropTypes.instanceOf( Map )
  , activeShare      : React.PropTypes.object
  , parentShared     : React.PropTypes.string
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
