// OS Settings
// ===========
// Display and modify FreeNAS Operating System settings

"use strict";

import React from "react";
import { Input, Panel, Button, ButtonToolbar } from "react-bootstrap";
import _ from "lodash";

import SM from "../../../../flux/middleware/SystemMiddleware";

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


  , handleChange ( key, event ) {
    switch ( key ) {
      case "autotune":
        this.setState( { autotune: event.target.checked } );
        break;
      case "console_cli":
        this.setState( { console_cli: event.target.checked } );
        break;
      case "powerd":
        this.setState( { powerd: event.target.checked } );
        break;
      case "uploadcrash":
        this.setState( { uploadcrash: event.target.checked } );
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
      <Input
        type = "checkbox"
        label = "Enable Autotune"
        checked = { autotuneValue }
        onChange = { this.handleChange.bind( this, "autotune" ) }>
      </Input>;

    if ( _.has( this, [ "state", "console_cli" ] ) ) {
      console_cliValue = this.state[ "console_cli" ];
    }
    console_cli =
      <Input
        type = "checkbox"
        label = "Enable Console CLI"
        checked = { console_cliValue }
        onChange = { this.handleChange.bind( this, "console_cli" ) }>
      </Input>;

    if ( _.has( this, [ "state", "powerd" ] ) ) {
      powerdValue = this.state[ "powerd" ];
    }
    powerd =
      <Input
        type = "checkbox"
        label = "Enable powerd"
        checked = { powerdValue }
        onChange = { this.handleChange.bind( this, "powerd" ) }>
      </Input>;

    if ( _.has( this, [ "state", "uploadcrash" ] ) ) {
      uploadcrashValue = this.state[ "uploadcrash" ];
    }
    uploadcrash =
      <Input
        type = "checkbox"
        label = "Automatically upload crash dumps to iXsystems"
        checked = { uploadcrashValue }
        onChange = { this.handleChange.bind( this, "uploadcrash" ) }>
      </Input>;

    if ( _.has( this, [ "state", "swapondrive" ] ) ) {
      swapondriveValue = this.state[ "swapondrive" ];
    }
    // Validate that it's an integer
    // Converting to human readable would be even better
    swapondrive =
      <Input
        type = "text"
        label = "Default swap on drive, in GB"
        value = { swapondriveValue }
        onChange = { this.handleChange.bind( this, "swapondrive" ) }>
      </Input>;

    if ( _.has( this, [ "state", "motd" ] ) ) {
      motdValue = this.state[ "motd" ];
    }
    motd =
      <Input
        type = "textarea"
        label = "Message of the Day to display at shell login"
        value = { motdValue }
        onChange = { this.handleChange.bind( this, "motd" ) }>
      </Input>;


    return (
      <Panel>
        <h4>Operating System </h4>
        <form className = "settings-config-form">
          { autotune }
          { console_cli }
          { powerd }
          { uploadcrash }
          { swapondrive }
          { motd }
        </form>
      </Panel>
    );
  }
});

export default OSSettings;
