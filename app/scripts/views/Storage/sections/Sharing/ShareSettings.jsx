// SHARE SETTINGS
// ==============
// Display the available settings for a share and its dataset

"use strict";

import React from "react";
import { Button, ButtonToolbar } from "react-bootstrap";

import AFPShareSettings from "./AFPShareSettings";
import SMBShareSettings from "./SMBShareSettings";
import NFSShareSettings from "./NFSShareSettings";
// import ISCSIShareSettings from "./ISCSIShareSettings";

// TODO: Find a better way to source this
const CONTAINER_PADDING = 15;

export default class ShareSettings extends React.Component {

  render () {
    const { name, show, activeShare } = this.props;
    var SettingsSection;

    let display = show
                ? null
                : "none";

    switch( this.props.type ) {
      case "afp":
        SettingsSection = <AFPShareSettings { ...this.props }/>;
        break;
      case "cifs":
        SettingsSection = <SMBShareSettings { ...this.props }/>;
        break;
      case "nfs":
        SettingsSection = <NFSShareSettings { ...this.props }/>;
        break;
      /*case "iscsi":
        SettingsSection = <iSCSIShareSettings  { ...this.props }/>;
        break;*/
      default:
        SettingsSection = null;
        break;
    }

    var formHandlers = null;

    if ( !this.props.newShare ) {
      formHandlers = (
        <div className="form-handlers">
            <ButtonToolbar>
              <Button
                bsStyle = "default"
                bsSize  = "small"
                onClick = { () => this.props.onRevertShare( this.props.id ) }
              >
                { "Revert" }
              </Button>
              <Button
                bsStyle = "primary"
                bsSize  = "small"
                onClick = { () => this.props.onSubmitShare( this.props.id ) }
              >
                { "Submit" }
              </Button>
            </ButtonToolbar>
          </div>
        );
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
        { SettingsSection }
        { formHandlers }
      </div>
    );
  }
};

ShareSettings.propTypes =
  { name          : React.PropTypes.string.isRequired
  , show          : React.PropTypes.bool
  , shiftLeft     : React.PropTypes.number.isRequired
  , activeShare   : React.PropTypes.object
  , updateDataset : React.PropTypes.object
  , newShare      : React.PropTypes.bool

  // HANDLERS
  , onUpdateShare: React.PropTypes.func.isRequired
  , onRevertShare: React.PropTypes.func.isRequired
  , onSubmitShare: React.PropTypes.func.isRequired
  };
