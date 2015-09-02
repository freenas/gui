// Webapp Settings
// ===========
// Display and modify FreeNAS Webapp connection settings

"use strict";

import React from "react";
import TWBS from "react-bootstrap";
import _ from "lodash";

import networkCommon from "../../Network/networkCommon";

const WebappSettings = React.createClass(
  { mixins: [ networkCommon ]

  , getDefaultProps () {
    return { webui_protocol: ""
           , webui_http_port: null
           , webui_http_redirect_https: null
           , webui_https_certificate: null
           , webui_listen: []
           , webui_https_port: null
           };
  }

  , handleWebappSettingsChange( key, event ) {
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
        onChange = { this.handleWebappSettingsChange.bind( this, "webui_protocol" ) }>
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
        onChange = { this.handleWebappSettingsChange.bind( this, "webui_http_port" ) }>
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
        onChange = { this.handleWebappSettingsChange.bind( this, "webui_https_port" ) }>
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
        onChange = { this.handleWebappSettingsChange.bind( this, "webui_https_certificate" ) }
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
        onChange = { this.handleWebappSettingsChange.bind( this, "webui_http_redirect_https" ) }>
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
        onChange = { this.handleWebappSettingsChange.bind( this, "webui_listen" ) }>
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

export default WebappSettings;
