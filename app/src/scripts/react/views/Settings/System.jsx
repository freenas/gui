// System Settings
// ===============
// Display and Modify FreeNAS GUI and OS settings.

"use strict";

import React from "react";
import { Grid, Row, Col } from "react-bootstrap";
import _ from "lodash";

import IM from "../../../flux/middleware/InterfacesMiddleware";
import IS from "../../../flux/stores/InterfacesStore"
import SM from "../../../flux/middleware/SystemMiddleware";
import SS from "../../../flux/stores/SystemStore";

import Console from "./System/Console";
import LocalizationSettings from "./System/LocalizationSettings";
import OSSettings from "./System/OSSettings";
import ConnectionSettings from "./System/ConnectionSettings";

function getSystemUIConfig () {
  return SS.systemUIConfig;
}

function getSystemGeneralConfig () {
  return SS.systemGeneralConfig;
}

function getSystemAdvancedConfig () {
  return SS.systemAdvancedConfig
}

function getInterfaces () {
  return IS.interfaces;
}

function getTimezones () {
  return SS.timezones;
}

function getKeymaps () {
  return SS.keymaps;
}

const System = React.createClass(
  { getInitialState () {
    return { general: {}
           , ui: {}
           , advanced: {}
           , interfaces: []
           , keymapList: []
           , timezoneList: []
           };
  }

  , componentDidMount () {
    IS.addChangeListener( this.handleInterfacesChange );
    IM.requestInterfacesList();
    IM.subscribe( this.constructor.displayName );

    SS.addChangeListener( this.handleSystemChange );
    SM.requestSystemGeneralConfig();
    SM.requestSystemUIConfig();
    SM.requestSystemAdvancedConfig();
    SM.requestKeymaps();
    SM.requestTimezones();
    SM.subscribe( this.constructor.displayName );
  }

  , handleSystemChange ( eventMask ) {
    switch ( eventMask ) {
      case "general":
        this.setState( { general: getSystemGeneralConfig() } );
        break;
      case "ui":
        this.setState( { ui: getSystemUIConfig() } );
        break;
      case "advanced":
        this.setState( { advanced: getSystemAdvancedConfig() } );
        break;
      case "keymaps":
        this.setState( { keymapList: getKeymaps() } );
        break;
      case "timezones":
        this.setState( { timezoneList: getTimezones() } );
        break;
    }
  }

  , handleInterfacesChange () {
    this.setState( { interfaces: getInterfaces() } );
  }

  , render () {
    return (
      <Grid>
        <Row>
          <Col xs = {4}>
            <ConnectionSettings
            { ...this.state.ui }/>
          </Col>
          <Col xs = {4}>
            <OSSettings
              motd = { this.state.advanced[ "motd" ] }
              uploadcrash = { this.state.advanced[ "uploadcrash" ] }
              swapondrive = { this.state.advanced[ "swapondrive" ] }
              powerd = { this.state.advanced[ "powerd" ] }
              console_cli = { this.state.advanced[ "console_cli" ] }
              autotune = { this.state.advanced[ "autotune" ] }/>
          </Col>
          <Col xs = {4}>
            <LocalizationSettings
              language = { this.state.general[ "language" ] }
              timezone = { this.state.general[ "timezone" ] }
              timezoneList = { this.state[ "timezoneList" ] }/>
          </Col>
        </Row>
        <Row>
          <Col xs = {4}>
            <Console
              console_screensaver = { this.state.advanced[ "console_screensaver" ] }
              serial_console = { this.state.advanced[ "serial_console" ] }
              serial_port = { this.state.advanced[ "serial_port" ] }
              serial_speed = { this.state.advanced[ "serial_speed" ] }
              console_keymap = { this.state.general[ "console_keymap" ] }
              keymapList = { this.state[ "keymapList" ] }/>
          </Col>
        </Row>
      </Grid>
    );
  }
});

export default System;
