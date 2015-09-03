// Hardware Settings
// =================
// Display and modify settings relating to the serial console (so far).

"use strict";

import React from "react";
import TWBS from "react-bootstrap";
import _ from "lodash";

import inputHelpers from "../../../mixins/inputHelpers";

// All settings in this panel are from system.advanced
const HardwareSettings = React.createClass(
  { getDefaultProps () {
  { mixins: [ inputHelpers ]

  , getDefaultProps () {
    return { console_screensaver: null
           , serial_console: null
           , serial_port: null
           , serial_speed: null
           };
  }

  , handleChange ( key, event ) {

    switch ( key ) {
      // FIXME: Wrong way to work with checkboxes
      case "console_screensaver":
        this.setState( { console_screensaver: event.target.value } );
        break;
      // FIXME: Wrong way to work with checkboxes
      case "serial_console":
        this.setState( { serial_console: event.target.value } );
        break;
      case "serial_port":
        this.setState( { serial_port: event.target.value } );
        break;
      case "serial_speed":
        this.setState( { serial_speed: event.target.value } );
        break;
    }
  }

  , render () {
    var console_screensaver = null;
    var console_screensaverValue = this.props[ "console_screensaver" ];
    var serial_console = null;
    var serial_consoleValue = this.props[ "serial_console" ];
    var serial_port = null;
    var serial_portValue = this.props[ "serial_port" ];
    var serial_speed = null;
    var serial_speedValue = this.props[ "serial_speed" ];


    if ( _.has( this, [ "state", "console_screensaver" ] ) ) {
      console_screensaverValue = this.state[ "console_screensaver" ];
    }
    console_screensaver =
      <TWBS.Input
        type = "checkbox"
        label = "Enable Console Screensaver"
        checked = { console_screensaverValue }
        onChange = { this.handleChange.bind( this
                                           , "console_screensaver" ) }/>

    if ( _.has( this, [ "state", "serial_console" ] ) ) {
      serial_consoleValue = this.state[ "serial_console" ];
    }
    serial_console =
      <TWBS.Input
        type = "checkbox"
        label = "Enable Serial Console"
        checked = { serial_consoleValue }
        onChange = { this.handleChange.bind( this
                                           , "serial_console" ) }/>

    if ( _.has( this, [ "state", "serial_port" ] ) ) {
      serial_portValue = this.state[ "serial_port" ];
    }
    // Make sure the port is valid
    serial_port =
      <TWBS.Input
        type = "select"
        label = "Serial Console Port"
        value = { serial_portValue}
        onChange = { this.handleChange.bind( this
                                           , "serial_port" ) }/>

    if ( _.has( this, [ "state", "serial_speed" ] ) ) {
      serial_speedValue = this.state[ "serial_speed" ];
    }
    serial_speed =
      <TWBS.Input
        type = "select"
        label = "Serial Port Speed"
        value = { serial_speedValue}
        onChange = { this.handleChange.bind( this
                                           , "serial_speed" ) }/>


    return (
      <TWBS.Panel>
        <h4>Hardware</h4>
        <form className = "settings-config-form">
          { console_screensaver }
          { serial_console }
          { serial_port }
          { serial_speed }
        </form>
      </TWBS.Panel>
    );
  }
});

export default HardwareSettings;
