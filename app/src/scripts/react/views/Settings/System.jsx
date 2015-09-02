// System Settings
// ===============
// Display and Modify FreeNAS GUI and OS settings.

"use strict";

import React from "react";
import TWBS from "react-bootstrap";
import _ from "lodash";

import SM from "../../../flux/middleware/SystemMiddleware";
import SS from "../../../flux/stores/SystemStore";

import LocalizationSettings from "./System/LocalizationSettings";
import OSSettings from "./System/OSSettings";

function getSystemUIConfig () {
  return SS.systemUIConfig;
}

// All settings in this panel are from system.advanced
const HardwareSettings = React.createClass(
  { getDefaultProps () {
    return { console_screensaver: null
           , serial_console: null
           , serial_port: null
           , serial_speed: null
           };
  }

  , render () {
    return (
      <TWBS.Panel>
        <h4>Hardware</h4>
      </TWBS.Panel>
    );
  }
});

const Tuneables = React.createClass(
  { render () {
    return (
      <TWBS.Panel>
        <h4>Tuneables</h4>
      </TWBS.Panel>
    );
  }
});

const UISettings = React.createClass(
  { getDefaultProps () {
    return { webui_protocol: ""
           , webui_http_port: null
           , webui_http_redirect_https: null
           , webui_https_certificate: null
           , webui_listen: []
           , webui_https_port: null
           };
  }

  , handleUISettingsChange( key, event ) {
    switch ( key ) {
      case "webui_protocol":
        this.setState( { webui_protocol: event.target.value } );
        break;
      case "webui_http_port":
        this.setState( { webui_http_port: event.target.value } );
        break;
      case "webui_https_port":
        this.setState( { webui_https_port: event.target.value } );
        break;
      case "webui_https_certificate":
        this.setState( { webui_https_certificate: event.target.value } );
        break;
      // FIXME: Wrong way to work with checkboxes
      case "webui_http_redirect_https":
        this.setState( { webui_http_redirect_https: event.target.value } );
        break;
      case "webui_listen":
        this.setState( { webui_listen: event.target.value } );
        break;
    }
  }

  , render () {
    var webui_protocol = null;
    var webui_protocolValue = this.props[ "webui_protocol" ];
    var webui_http_port = null;
    var webui_http_redirect_httpsValue = this.props[ "webui_http_redirect_https" ];
    var webui_https_port = null;
    var webui_https_portValue = this.props[ "webui_https_port" ];
    var webui_https_certificate = null;
    var webui_https_certificateValue = this.props[ "webui_https_certificate" ];
    var webui_http_portValue = this.props[ "webui_http_port" ];
    var webui_http_redirect_https = null;
    var webui_listen = null;
    var webui_listenValue = this.props[ "webui_listen" ];

    if (_.has( this, [ "state", "webui_protocol" ] ) ) {
      webui_protocolValue = this.state[ "webui_protocol" ];
    }
    webui_protocol =
      <TWBS.Input
        type = "select"
        label = "Webapp Protocol"
        value = { webui_protocolValue }
        onChange = { this.handleUISettingsChange.bind( this, "webui_protocol" ) }>
      </TWBS.Input>;

    if (_.has( this, [ "state", "webui_http_port" ] ) ) {
      webui_http_portValue = this.state[ "webui_http_port" ];
    }
    // TODO: Check that it's an integer in the valid range
    webui_http_port =
      <TWBS.Input
        type = "text"
        label = "Webapp HTTP Port"
        value = { webui_http_portValue }
        onChange = { this.handleUISettingsChange.bind( this, "webui_http_port" ) }>
      </TWBS.Input>;

    if (_.has( this, [ "state", "webui_https_port" ] ) ) {
      webui_https_portValue = this.state[ "webui_https_port" ];
    }
    // TODO: Check that it's an integer in the valid range
    webui_https_port =
      <TWBS.Input
        type = "text"
        label = "Webapp HTTPS Port"
        value = { webui_https_portValue }
        onChange = { this.handleUISettingsChange.bind( this, "webui_https_port" ) }>
      </TWBS.Input>;

    if (_.has( this, [ "state", "webui_https_certificate" ] ) ) {
      webui_https_certificateValue = this.state[ "webui_https_certificate" ];
    }
    // Depends on certificat configuration
    webui_https_certificate =
      <TWBS.Input
        type = "select"
        label = "Webapp SSL/TLS Certificate"
        value = { webui_https_certificateValue }
        onChange = { this.handleUISettingsChange.bind( this, "webui_https_certificate" ) }
        disabled>
      </TWBS.Input>;

    if (_.has( this, [ "state", "webui_http_redirect_https" ] ) ) {
      webui_http_redirect_httpsValue = this.state[ "webui_http_redirect_https" ];
    }
    webui_http_redirect_https =
      <TWBS.Input
        type = "checkbox"
        label = "Redirect HTTP to HTTPS"
        checked = { webui_http_redirect_httpsValue }
        onChange = { this.handleUISettingsChange.bind( this, "webui_http_redirect_https" ) }>
      </TWBS.Input>;

    if (_.has( this, [ "state", "webui_listen" ] ) ) {
      webui_listenValue = this.state[ "webui_listen" ];
    }
    // Choose among available IPs
    webui_listen =
      <TWBS.Input
        type = "select"
        multiple
        label = "Webapp IP Addresses"
        value = { webui_listenValue }
        onChange = { this.handleUISettingsChange.bind( this, "webui_listen" ) }>
      </TWBS.Input>;

    return (
      <TWBS.Panel>
        <h4>Webapp</h4>
        <form className = "settings-config-form">
          { webui_protocol }
          { webui_http_port }
          { webui_https_port }
          { webui_https_certificate }
          { webui_http_redirect_https }
          { webui_listen }
        </form>
      </TWBS.Panel>
    );
  }
});

const System = React.createClass(
  { render () {
    return (
      <TWBS.Grid>
        <TWBS.Row>
          <TWBS.Col xs = {4}>
            <UISettings/>
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
            <HardwareSettings/>
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
