// System Settings
// ===============
// Display and Modify FreeNAS GUI and OS settings.

"use strict";

import React from "react";
import TWBS from "react-bootstrap";
import _ from "lodash";

import IM from "../../../flux/middleware/InterfacesMiddleware";
import IS from "../../../flux/stores/InterfacesStore"
import SM from "../../../flux/middleware/SystemMiddleware";
import SS from "../../../flux/stores/SystemStore";

import Console from "./System/Console";
import LocalizationSettings from "./System/LocalizationSettings";
import OSSettings from "./System/OSSettings";
import Tuneables from "./System/Tuneables";
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
      <TWBS.Grid>
        <TWBS.Row>
          <TWBS.Col xs = {4}>
            <ConnectionSettings/>
          </TWBS.Col>
          <TWBS.Col xs = {4}>
            <OSSettings/>
          </TWBS.Col>
          <TWBS.Col xs = {4}>
            <LocalizationSettings/>
          </TWBS.Col>
        </TWBS.Row>
        <TWBS.Row>
          <TWBS.Col xs = {4}>
            <Console
          </TWBS.Col>
          <TWBS.Col xs = {8}>
            <Tuneables/>
          </TWBS.Col>
        </TWBS.Row>
      </TWBS.Grid>
    );
  }
});

export default System;
