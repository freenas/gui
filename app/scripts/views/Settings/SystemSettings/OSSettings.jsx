// OS Settings
// ===========
// Display and modify FreeNAS Operating System settings

"use strict";

import React from "react";
import { Input, Panel, Button, ButtonToolbar } from "react-bootstrap";

// All settings in this panel are from system.advanced
const OSSettings = ( props ) => {

  var autotuneValue = typeof props.osForm.autotune !== "undefined"
                    ? props.osForm.autotune
                    : props.advanced.autotune;
  var consoleCLIValue = typeof props.osForm.console_cli !== "undefined"
                      ? props.osForm.console_cli
                      : props.advanced.console_cli;
  var powerdValue = typeof props.osForm.powerd !== "undefined"
                  ? props.osForm.powerd
                  : props.advanced.powerd;
  var uploadcrashValue = typeof props.osForm.uploadcrash !== "undefined"
                       ? props.osForm.uploadcrash
                       : props.advanced.uploadcrash;
  var swapondriveValue = typeof props.osForm.swapondrive !== "undefined"
                       ? props.osForm.swapondrive
                       : props.advanced.swapondrive;
  var motdValue = typeof props.osForm.motd !== "undefined"
                ? props.osForm.motd
                : props.advanced.motd;

  const autotune =
    <Input
      type = "checkbox"
      label = "Enable Autotune"
      checked = { autotuneValue }
      onChange = { ( e ) => props.updateOSForm( "autotune"
                                              , e.target.checked
                                              )
                 }
    >
    </Input>;

  const consoleCLI =
    <Input
      type = "checkbox"
      label = "Enable Console CLI"
      checked = { consoleCLIValue }
      onChange = { ( e ) => props.updateOSForm( "console_cli"
                                              , e.target.checked
                                              )
                 }
    >
    </Input>;

  const powerd =
    <Input
      type = "checkbox"
      label = "Enable powerd"
      checked = { powerdValue }
      onChange = { ( e ) => props.updateOSForm( "powerd"
                                              , e.target.checked
                                              )
                 }
    >
    </Input>;

  const uploadCrash =
    <Input
      type = "checkbox"
      label = "Automatically upload crash dumps to iXsystems"
      checked = { uploadcrashValue }
      onChange = { ( e ) => props.updateOSForm( "uploadcrash"
                                              , e.target.checked
                                              )
                 }
    >
    </Input>;

  // Validate that it's an integer
  // Converting to human readable would be even better
  const swapOnDrive =
    <Input
      type = "text"
      label = "Default swap on drive, in GB"
      value = { swapondriveValue }
      onChange = { ( e ) => props.updateOSForm( "swapondrive"
                                              , e.target.value
                                              )
                 }
    >
    </Input>;

  const motd =
    <Input
      type = "textarea"
      label = "Message of the Day to display at shell login"
      value = { motdValue }
      onChange = { ( e ) => props.updateOSForm( "motd"
                                              , e.target.value
                                              )
                 }
    >
    </Input>;

  const formControlButtons =
    <ButtonToolbar className = "pull-right">
      <Button
        bsStyle = "default"
        onClick = { props.resetOSForm }
        // disabled = {/* need test for this*/ }
      >
        { "Reset" }
      </Button>
      <Button
        bsStyle = "primary"
        onClick = { props.submitOSTask }
        // disabled = {/* need test for this*/ }
      >
        { "Apply" }
      </Button>
    </ButtonToolbar>;

  return (
    <Panel>
      <h4>Operating System</h4>
      <form className = "settings-config-form">
        { autotune }
        { consoleCLI }
        { powerd }
        { uploadCrash }
        { swapOnDrive }
        { motd }
        { formControlButtons }
      </form>
    </Panel>
  );
};

OSSettings.propTypes =
  { advanced: React.PropTypes.shape(
    { motd: React.PropTypes.string
    , uploadcrash: React.PropTypes.bool
    , swapondrive: React.PropTypes.number // in GB
    , powerd: React.PropTypes.bool
    , console_cli: React.PropTypes.bool
    , autotune: React.PropTypes.bool
    }
  )
  , osForm: React.PropTypes.shape(
    { motd: React.PropTypes.string
    , uploadcrash: React.PropTypes.bool
    , swapondrive: React.PropTypes.number // in GB
    , powerd: React.PropTypes.bool
    , console_cli: React.PropTypes.bool
    , autotune: React.PropTypes.bool
    }
  )
  , updateOSForm: React.PropTypes.func
  , resetOSForm: React.PropTypes.func
  , submitOSTask: React.PropTypes.func
  };

export default OSSettings;
