// OS Settings
// ===========
// Display and modify FreeNAS Operating System settings

"use strict";

import React from "react";
import TWBS from "react-bootstrap";
import _ from "lodash";

// All settings in this panel are from system.advanced
const OSSettings = React.createClass(
  { getDefaultProps () {
    return { motd: ""
           , uploadcrash: null
           , swapondrive: null
           , powerd: null
           , console_cli: null
           , autotune: null
           };
  }

  , handleOSSettingsChange ( key, event ) {
    var language = "";
    var timezone = "";
    var console_keymap = "";

    switch ( key ) {
      // FIXME: Wrong way to work with checkboxes
      case "autotune":
        this.setState( { autotune: event.target.value } );
        break;
      // FIXME: Wrong way to work with checkboxes
      case "console_cli":
        this.setState( { console_cli: event.target.value } );
        break;
      // FIXME: Wrong way to work with checkboxes
      case "powerd":
        this.setState( { powerd: event.target.value } );
        break;
      // FIXME: Wrong way to work with checkboxes
      case "uploadcrash":
        this.setState( { uploadcrash: event.target.value } );
        break;
      case "swapondrive":
        this.setState( { swapondrive: event.target.value } );
        break;
      case "motd":
        this.setState( { motd: event.target.value } );
        break;
    }
  }

  , render () {
    var autotune = null;
    var autotuneValue = this.props[ "autotune" ];
    var console_cli = null;
    var console_cliValue = this.props[ "console_cli" ];
    var powerd = null;
    var powerdValue = this.props[ "powerd" ];
    var uploadcrash = null;
    var uploadcrashValue = this.props[ "uploadcrash" ];
    var swapondrive = null;
    var swapondriveValue = this.props[ "swapondrive" ];
    var motd = null;
    var motdValue = this.props[ "motd" ];

    if ( _.has( this, [ "state", "autotune" ] ) ) {
      autotuneValue = this.state[ "autotune" ];
    }
    autotune =
      <TWBS.Input
        type = "checkbox"
        label = "Enable Autotune"
        checked = { autotuneValue }
        onChange = { this.handleOSSettingsChange.bind( this, "autotune" ) }>
      </TWBS.Input>;

    if ( _.has( this, [ "state", "console_cli" ] ) ) {
      console_cliValue = this.state[ "console_cli" ];
    }
    console_cli =
      <TWBS.Input
        type = "checkbox"
        label = "Enable Console CLI"
        checked = { console_cliValue }
        onChange = { this.handleOSSettingsChange.bind( this, "console_cli" ) }>
      </TWBS.Input>;

    if ( _.has( this, [ "state", "powerd" ] ) ) {
      powerdValue = this.state[ "powerd" ];
    }
    powerd =
      <TWBS.Input
        type = "checkbox"
        label = "Enable powerd"
        checked = { powerdValue }
        onChange = { this.handleOSSettingsChange.bind( this, "powerd" ) }>
      </TWBS.Input>;

    if ( _.has( this, [ "state", "uploadcrash" ] ) ) {
      uploadcrashValue = this.state[ "uploadcrash" ];
    }
    uploadcrash =
      <TWBS.Input
        type = "checkbox"
        label = "Automatically upload crash dumps to iXsystems"
        checked = { uploadcrashValue }
        onChange = { this.handleOSSettingsChange.bind( this, "uploadcrash" ) }>
      </TWBS.Input>;

    if ( _.has( this, [ "state", "swapondrive" ] ) ) {
      swapondriveValue = this.state[ "swapondrive" ];
    }
    // Validate that it's an integer
    swapondrive =
      <TWBS.Input
        type = "text"
        label = "Default swap on drive, in GB"
        value = { swapondriveValue }
        onChange = { this.handleOSSettingsChange.bind( this, "swapondrive" ) }>
      </TWBS.Input>;

    if ( _.has( this, [ "state", "motd" ] ) ) {
      motdValue = this.state[ "motd" ];
    }
    motd =
      <TWBS.Input
        type = "textarea"
        label = "Message of the Day to display at shell login"
        value = { motdValue }
        onChange = { this.handleOSSettingsChange.bind( this, "motd" ) }>
      </TWBS.Input>;


    return (
      <TWBS.Panel>
        <h4>Operating System </h4>
        <form className = "settings-config-form">
          { autotune }
          { console_cli }
          { powerd }
          { uploadcrash }
          { swapondrive }
          { motd }
        </form>
      </TWBS.Panel>
    );
  }
});

export default OSSettings;
