// Hardware Settings
// =================
// Display and modify settings relating to the serial console (so far).

"use strict";

import React from "react";
import { Input, Panel, Button, ButtonToolbar } from "react-bootstrap";

// This *might* be bad.
// TODO: Find out if this is bad.
const serialPortSpeeds =
  [ 9600
  , 19200
  , 38400
  , 57600
  , 115200
  ];

function createKeymapOptions ( keymapArray ) {
  var options =
    keymapArray.map(
      function mapOptions ( keymap, index ) {
        return (
          <option
            value = { keymap[0] }
            key = { index }
          >
            { keymap[1] }
          </option>
        );
      }
    );
  return options;
}

function createSimpleOptions ( optionArray ) {
  var options =
    optionArray.map(
      function mapOptions ( option, index ) {
        return (
          <option
            value = { option }
            key = { index }
          >
           { option }
          </option>
        );
      }
   );
  return options;
}

const Console = ( props ) => {

  var consoleScreensaverValue = typeof props.consoleForm.console_screensaver
                            !== "undefined"
                              ? props.consoleForm.console_screensaver
                              : props.advanced.console_screensaver;
  var serialConsoleValue = typeof props.consoleForm.serial_console
                       !== "undefined"
                         ? props.consoleForm.serial_console
                         : props.advanced.serial_console;
  var serialPortValue = typeof props.consoleForm.serial_port
                    !== "undefined"
                      ? props.consoleForm.serial_port
                      : props.advanced.serial_port;
  var serialSpeedValue = typeof props.consoleForm.serial_speed
                     !== "undefined"
                       ? props.consoleForm.serial_speed
                       : props.advanced.serial_speed;
  var consoleKeymapValue = typeof props.consoleForm.console_keymap
                       !== "undefined"
                         ? props.consoleForm.console_keymap
                         : props.advanced.console_keymap;

  const keymapOptions = createKeymapOptions( props.general.keymaps );
  const serialPortOptions = createSimpleOptions( props.advanced.serial_ports );
  const serialPortSpeedOptions = createSimpleOptions( serialPortSpeeds ) ;

  const consoleScreensaver =
    <Input
      type = "checkbox"
      label = "Enable Console Screensaver"
      checked = { consoleScreensaverValue }
      onChange = { ( e ) => props.updateConsoleForm( "console_screensaver"
                                                   , e.target.checked
                                                   )
                 }
    />;

  const serialConsole =
    <Input
      type = "checkbox"
      label = "Enable Serial Console"
      checked = { serialConsoleValue }
      onChange = { ( e ) => props.updateConsoleForm( "serial_console"
                                                   , e.target.checked
                                                   )
                 }
    />;

  // Make sure the port is valid
  const serialPort =
    <Input
      type = "select"
      label = "Serial Console Port"
      value = { serialPortValue }
      onChange = { ( e ) => props.updateConsoleForm( "serial_port"
                                                   , e.target.value
                                                   )
                 }
    >
      { serialPortOptions }
     </Input>;

  const serialSpeed =
    <Input
      type = "select"
      label = "Serial Port Speed"
      value = { serialSpeedValue }
      onChange = { ( e ) => props.updateConsoleForm( "serial_speed"
                                                   , e.target.value
                                                   )
                 }
    >
      { serialPortSpeedOptions }
     </Input>;

  const consoleKeymap =
    <Input
      type = "select"
      label = "Console Keymap"
      value = { consoleKeymapValue }
      onChange = { ( e ) => props.updateConsoleForm( "console_keymap"
                                                   , e.target.value
                                                   )
                }
    >
      { keymapOptions }
    </Input>;

  const formControlButtons =
    <ButtonToolbar className = "pull-right">
      <Button
        bsStyle = "default"
        onClick = { props.submitConsoleTask }
        // disabled = {/* need test for this*/ }
      >
        { "Reset" }
      </Button>
      <Button
        bsStyle = "primary"
        onClick = { props.submitConsoleTask  }
        // disabled = {/* need test for this*/ }
      >
        { "Apply" }
      </Button>
    </ButtonToolbar>;

  return (
    <Panel>
      <h4>Console</h4>
      <form className = "settings-config-form">
        { consoleScreensaver }
        { serialConsole }
        { serialPort }
        { serialSpeed }
        { consoleKeymap }
        { formControlButtons }
      </form>
    </Panel>
  );
};

Console.propTypes =
  { advanced: React.PropTypes.shape(
    { console_screensaver: React.PropTypes.bool
    , serial_console: React.PropTypes.bool
    , serial_port: React.PropTypes.string
    , serial_speed: React.PropTypes.string
    , console_keymap: React.PropTypes.string
    , serial_ports: React.PropTypes.arrayOf(
                      React.PropTypes.string
                    )
    }
  )
  , general: React.PropTypes.shape(
    { keymaps: React.PropTypes.arrayOf(
                 React.PropTypes.arrayOf(
                   React.PropTypes.string
                 )
               )
    }
  )
  , consoleForm: React.PropTypes.shape(
    { console_screensaver: React.PropTypes.bool
    , serial_console: React.PropTypes.bool
    , serial_port: React.PropTypes.string
    , serial_speed: React.PropTypes.string
    , console_keymap: React.PropTypes.string
    }
  )
  , updateConsoleForm: React.PropTypes.func
  , resetConsoleForm: React.PropTypes.func
  , submitConsoleTask: React.PropTypes.func
  };

export default Console;
