// Hardware Settings
// =================
// Display and modify settings relating to the serial console (so far).

"use strict";

import React from "react";
import { Input, Panel, Button, ButtonToolbar } from "react-bootstrap";
import _ from "lodash";

import SM from "../../../flux/middleware/SystemMiddleware";

import inputHelpers from "../../../mixins/inputHelpers";

const serialPortSpeeds =
  [ 9600
  , 19200
  , 38400
  , 57600
  , 115200
  ];

// This is bad. Get real data ASAP.
const serialPorts =
  [ "0x248"
  , "0x3f8"
  ];

function createKeymapOptions ( keymapArray ) {
  var options =
    _.map( keymapArray
         , function mapOptions ( keymap, index ) {
           return (
             <option
               value = { keymap[0] }
               key = { index }>
               { keymap[1] }
             </option>
             );
         }
         );
  return options;
}

// All settings in this panel are from system.advanced
const Console = React.createClass(
  { mixins: [ inputHelpers ]

  , getDefaultProps () {
    return { console_screensaver: null
           , serial_console: null
           , serial_port: null
           , serial_speed: null
           , console_keymap: null
           , keymapList: []
           };
  }

  , handleChange ( key, event ) {

    switch ( key ) {
      case "console_screensaver":
        this.setState( { console_screensaver: event.target.checked } );
        break;
      case "serial_console":
        this.setState( { serial_console: event.target.checked } );
        break;
      case "serial_port":
        this.setState( { serial_port: event.target.value } );
        break;
      case "serial_speed":
        this.setState( { serial_speed: event.target.value } );
        break;
      case "console_keymap":
        this.setState( { console_keymap: event.target.value } );
        break;
    }
  }

  , submit () {
    var newAdvancedConfig = {};
    var newGeneralConfig = {};

    if ( _.has( this, [ "state", "console_screensaver" ] ) ) {
      newAdvancedConfig.console_screensaver = this.state.console_screensaver
    }
    if ( _.has( this, [ "state", "serial_console" ] ) ) {
      newAdvancedConfig.serial_console = this.state.serial_console
    }
    if ( _.has( this, [ "state", "serial_port" ] ) ) {
      newAdvancedConfig.serial_port = this.state.serial_port
    }
    if ( _.has( this, [ "state", "serial_speed" ] ) ) {
      newAdvancedConfig.serial_speed = Number.parseInt( this.state.serial_speed );
    }
    if ( _.has( this, [ "state", "console_keymap" ] ) ) {
      newGeneralConfig.console_keymap = this.state.console_keymap
    }

    if ( !_.isEmpty( newAdvancedConfig) ) {
      SM.updateSystemAdvancedConfig( newAdvancedConfig );
    }
    if ( !_.isEmpty( newGeneralConfig ) ) {
      SM.updateSystemGeneralConfig( newGeneralConfig );
    }
  }

  , resetAll () {
    this.replaceState( null );
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
    var console_keymap = null;
    var console_keymapValue = this.props[ "console_keymap" ];
    var formControlButtons = null;

    const keymapOptions = createKeymapOptions( this.props[ "keymapList" ] );

    if ( _.has( this, [ "state", "console_screensaver" ] ) ) {
      console_screensaverValue = this.state[ "console_screensaver" ];
    }
    console_screensaver =
      <Input
        type = "checkbox"
        label = "Enable Console Screensaver"
        checked = { console_screensaverValue }
        onChange = { this.handleChange.bind( this
                                           , "console_screensaver" ) }/>

    if ( _.has( this, [ "state", "serial_console" ] ) ) {
      serial_consoleValue = this.state[ "serial_console" ];
    }
    serial_console =
      <Input
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
      <Input
        type = "select"
        label = "Serial Console Port"
        value = { serial_portValue }
        onChange = { this.handleChange.bind( this
                                           , "serial_port" ) }>
        { this.createSimpleOptions( serialPorts ) }
      </Input>

    if ( _.has( this, [ "state", "serial_speed" ] ) ) {
      serial_speedValue = this.state[ "serial_speed" ];
    }
    serial_speed =
      <Input
        type = "select"
        label = "Serial Port Speed"
        value = { serial_speedValue }
        onChange = { this.handleChange.bind( this
                                           , "serial_speed" ) }>
        { this.createSimpleOptions( serialPortSpeeds ) }
      </Input>

    if ( _.has( this, [ "state", "console_keymap" ] ) ) {
      console_keymapValue = this.state[ "console_keymap" ];
    }
    console_keymap =
      <Input
        type = "select"
        label = "Console Keymap"
        value = { console_keymapValue }
        onChange = { this.handleChange.bind( this
                                           , "console_keymap" ) }>
        { keymapOptions }
      </Input>

    formControlButtons =
      <ButtonToolbar className = "pull-right">
        <Button
          bsStyle = "default"
          onClick = { this.resetAll }
          disabled = { _.isEmpty( this.state ) }>
          { "Reset" }
        </Button>
        <Button
          bsStyle = "primary"
          onClick = { this.submit  }
          disabled = { _.isEmpty( this.state ) }>
          { "Apply" }
        </Button>
      </ButtonToolbar>;

    return (
      <Panel>
        <h4>Console</h4>
        <form className = "settings-config-form">
          { console_screensaver }
          { serial_console }
          { serial_port }
          { serial_speed }
          { console_keymap }
          { formControlButtons }
        </form>
      </Panel>
    );
  }
});

export default Console;
