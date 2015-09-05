// Webapp Settings
// ===========
// Display and modify FreeNAS Webapp connection settings

"use strict";

import React from "react";
import { Input, Panel, Button, ButtonToolbar } from "react-bootstrap";
import _ from "lodash";

import SM from "../../../../flux/middleware/SystemMiddleware"

import networkCommon from "../../Network/networkCommon";

const ConnectionSettings = React.createClass(
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

  , handleChange ( key, event ) {
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
      case "webui_http_redirect_https":
        this.setState( { webui_http_redirect_https: event.target.checked } );
        break;
      case "webappListenAll":
        this.setState( { webappListenAll: event.target.checked } );
        break;
      case "webui_listen":
        this.setState( { webui_listen: event.target.value } );
        break;
    }
  }

  , submit () {
    var newConfig = {};

    if ( _.has( this, [ "state", "webui_protocol" ] ) ) {
      newConfig.webui_protocol = this.state.webui_protocol;
    }
    if ( _.has( this, [ "state", "webui_http_port" ] ) ) {
      newConfig.webui_http_port = Number.parseInt( this.state.webui_http_port, 10 );
    }
    if ( _.has( this, [ "state", "webui_https_port" ] ) ) {
      newConfig.webui_https_port = Number.parseInt( this.state.webui_https_port, 10 );
    }
    if ( _.has( this, [ "state", "webui_https_certificate" ] ) ) {
      newConfig.webui_https_certificate = this.state.webui_https_certificate;
    }
    if ( _.has( this, [ "state", "webui_http_redirect_https" ] ) ) {
      newConfig.webui_http_redirect_https = this.state.webui_http_redirect_https;
    }
    if ( _.has( this, [ "state", "webappListenAll" ] ) ) {
      newConfig.webui_listen = [ "0.0.0.0", "::" ];
    } else if ( _.has( this, [ "state", "webui_listen" ] ) ) {
      newConfig.webui_listen = this.state.webui_listen;
    }

    if ( !_.isEmpty( newConfig ) ) {
      SM.updateSystemUIConfig( newConfig );
    }
  }

  , resetAll () {
    this.replaceState( null );
  }

  , render () {
    var webui_protocol = null;
    var webui_protocolRealValue = this.props[ "webui_protocol" ];
    var webui_protocolValue = ""
    var webui_http_port = null;
    var webui_http_portValue = this.props[ "webui_http_port" ];
    var webui_https_port = null;
    var webui_https_portValue = this.props[ "webui_https_port" ];
    var webui_https_certificate = null;
    var webui_https_certificateValue = this.props[ "webui_https_certificate" ];
    var webui_http_redirect_https = null;
    var webui_http_redirect_httpsValue = this.props[ "webui_http_redirect_https" ];
    var webappListenAll = null;
    // webappListenAllValue must be false by default, because it won't be in
    // props and may not be in state.
    var webappListenAllValue = false;
    var webui_listen = null;
    var webui_listenValue = this.props[ "webui_listen" ];
    var formControlButtons = null;

    if (_.has( this, [ "state", "webui_protocol" ] ) ) {
      webui_protocolRealValue = this.state[ "webui_protocol" ];
    }

    if ( webui_protocolRealValue === [ "HTTP" ] ) {
      webui_protocolValue = "http";
    } else if ( webui_protocolRealValue === [ "HTTPS" ] ) {
      webui_protocolValue = "https";
    } else if ( webui_protocolRealValue === [ "HTTP", "HTTPS" ]
             || webui_protocolRealValue === [ "HTTPS", "HTTP" ]
              ) {
      webui_protocolValue = "both";
    }
    webui_protocol =
      <Input
        type = "select"
        label = "Protocol"
        value = { webui_protocolValue }
        onChange = { this.handleChange.bind( this, "webui_protocol" ) }>
        <option
          value = { "http" }
          key = { "http" }>
          { "HTTP" }
        </option>
        <option
          value = { "https" }
          key = { "https" }>
          { "HTTPS" }
        </option>
        <option
          value = { "both" }
          key = { "both" }>
          { "HTTP and HTTPS" }
        </option>
      </Input>;

    if (_.has( this, [ "state", "webui_http_port" ] ) ) {
      webui_http_portValue = this.state[ "webui_http_port" ];
    }
    // TODO: Check that it's an integer in the valid range
    webui_http_port =
      <Input
        type = "text"
        label = "HTTP Port"
        value = { webui_http_portValue }
        onChange = { this.handleChange.bind( this, "webui_http_port" ) }/>;

    if (_.has( this, [ "state", "webui_https_port" ] ) ) {
      webui_https_portValue = this.state[ "webui_https_port" ];
    }
    // TODO: Check that it's an integer in the valid range
    webui_https_port =
      <Input
        type = "text"
        label = "HTTPS Port"
        value = { webui_https_portValue }
        onChange = { this.handleChange.bind( this, "webui_https_port" ) }/>;

    if (_.has( this, [ "state", "webui_https_certificate" ] ) ) {
      webui_https_certificateValue = this.state[ "webui_https_certificate" ];
    }
    // Depends on certificate configuration
    webui_https_certificate =
      <Input
        type = "select"
        label = "SSL/TLS Certificate"
        value = { webui_https_certificateValue }
        onChange = { this.handleChange.bind( this, "webui_https_certificate" ) }
        disabled>
      { /*An array of options based on the available certificates goes here.*/ }
      </Input>;

    if (_.has( this, [ "state", "webui_http_redirect_https" ] ) ) {
      webui_http_redirect_httpsValue = this.state[ "webui_http_redirect_https" ];
    }
    webui_http_redirect_https =
      <Input
        type = "checkbox"
        label = "Redirect HTTP to HTTPS"
        checked = { webui_http_redirect_httpsValue }
        onChange = { this.handleChange.bind( this, "webui_http_redirect_https" ) }
        disabled = { webui_protocolValue === "http" } />;

    if (_.has( this, [ "state", "webappListenAll" ] ) ) {
      webappListenAllValue = this.state[ "webappListenAll" ];
    }
    // Allows ALL IPs, overriding available IP choices
    webappListenAll =
      <Input
        type = "checkbox"
        checked = { webappListenAllValue}
        label = "Allow Access Over All IP Addresses"
        onChange = { this.handleChange.bind( this, "webappListenAll" ) }/>;

    if (_.has( this, [ "state", "webui_listen" ] ) ) {
      webui_listenValue = this.state[ "webui_listen" ];
    }
    // Choose among available IPs
    webui_listen =
      <Input
        type = "select"
        multiple
        disabled = { webappListenAllValue }
        label = "IP Addresses"
        value = { webui_listenValue }
        onChange = { this.handleChange.bind( this, "webui_listen" ) }>
      </Input>;

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
        <h4>Management Connection</h4>
        <form className = "settings-config-form">
          { webui_protocol }
          { webui_http_port }
          { webui_https_port }
          { webui_https_certificate }
          { webui_http_redirect_https }
          { webappListenAll }
          { webui_listen }
          { formControlButtons }
        </form>
      </Panel>
    );
  }
});

export default ConnectionSettings;
