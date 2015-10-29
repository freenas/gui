// SHARE SETTINGS
// ==============
// Display the available settings for a share and its dataset

"use strict";

import React from "react";
import { Button, ButtonToolbar, Input } from "react-bootstrap";

// TODO: Find a better way to source this
const CONTAINER_PADDING = 15;

export default class ShareSettings extends React.Component {
  onDatasetNameChange ( event ) {
    const NAME = event.target.value;

    const newDataset =
      { pool_name : this.props.pool
      , path      : this.props.name
      , params:
        { name: this.props.name.replace( /([^\/]*$)/i, NAME )
        }
      };

    this.props.handlers.datasetUpdate.onChange( newDataset );
  }

  assignValues () {
    const { updateDataset, activeShare } = this.props;
    let datasetParams = {};
    let shareParams = {};

    if ( updateDataset && updateDataset.params ) {
      datasetParams.name = updateDataset.params.name;
    }

    if ( activeShare ) {
      shareParams.exportName = activeShare.id;
    }

    return Object.assign(
      { name       : this.props.name
      , exportName : ""
      }
      , datasetParams
      , shareParams
    );
  }

  render () {
    const { name, show, activeShare } = this.props;
    const VALUES = this.assignValues();

    let display = show
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
              label = "Name"
              value = { VALUES.name.split( "/" ).pop() }
              onChange = { this.onDatasetNameChange.bind( this ) }
              labelClassName = "col-xs-2"
              wrapperClassName = "col-xs-10"
            />
            <Input
              disabled = { !activeShare }
              type = "text"
              label = "Export As"
              value = { VALUES.exportName }
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
              onClick = { this.props.handlers.datasetUpdate.onSubmit }
            >
              { "Submit" }
            </Button>
          </ButtonToolbar>
        </div>
      </div>
    );
  }
}

ShareSettings.propTypes =
  { name          : React.PropTypes.string.isRequired
  , show          : React.PropTypes.bool
  , shiftLeft     : React.PropTypes.number.isRequired
  , share_type    : React.PropTypes.oneOf([ "UNIX", "MAC", "WINDOWS" ])
  , activeShare   : React.PropTypes.object
  , updateDataset : React.PropTypes.object
  , handlers : React.PropTypes.shape(
      { onShareCreate     : React.PropTypes.func.isRequired
      , onShareDelete     : React.PropTypes.func.isRequired
      , onDatasetActive   : React.PropTypes.func.isRequired
      , onDatasetInactive : React.PropTypes.func.isRequired
      , onDatasetChange   : React.PropTypes.func.isRequired
      , datasetUpdate: React.PropTypes.shape(
          { onChange: React.PropTypes.func.isRequired
          , onSubmit: React.PropTypes.func.isRequired
          , onRevert: React.PropTypes.func.isRequired
          }
        )
      , nameIsPermitted   : React.PropTypes.func.isRequired
      }
    ).isRequired
  };
