// HAProxy Configuration
// =====================

"use strict";

import React from "react";
import { Button, ButtonToolbar, Input, Panel } from "react-bootstrap";

import ToggleSwitch from "../../../components/ToggleSwitch";

const MODES = [ "HTTP", "TCP" ];

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

const HAProxy = ( props ) => {

  const frontend_modeValue = typeof props.haproxyForm.frontend_mode !== "undefined"
                           ? props.haproxyForm.frontend_mode
                           : props.haproxyServerState.frontend_mode;
  const defaults_maxconnValue = typeof props.haproxyForm.defaults_maxconn !== "undefined"
                              ? props.haproxyForm.defaults_maxconn
                              : props.haproxyServerState.defaults_maxconn;
  const https_portValue = typeof props.haproxyForm.https_port !== "undefined"
                        ? props.haproxyForm.https_port
                        : props.haproxyServerState.https_port;
  const global_maxconnValue = typeof props.haproxyForm.global_maxconn !== "undefined"
                            ? props.haproxyForm.global_maxconn
                            : props.haproxyServerState.global_maxconn;
  const backend_modeValue = typeof props.haproxyForm.backend_mode !== "undefined"
                          ? props.haproxyForm.backend_mode
                          : props.haproxyServerState.backend_mode;
  const http_ipValue = typeof props.haproxyForm.http_ip !== "undefined"
                     ? props.haproxyForm.http_ip
                     : props.haproxyServerState.http_ip;
  const http_portValue = typeof props.haproxyForm.http_port !== "undefined"
                       ? props.haproxyForm.http_port
                       : props.haproxyServerState.http_port;
  const https_ipValue = typeof props.haproxyForm.https_ip !== "undefined"
                      ? props.haproxyForm.https_ip
                      : props.haproxyServerState.https_ip;

  const toggleService = (
    <div className = "pull-right" >
      <ToggleSwitch
        toggled = { props.haproxyServerState.enable }
        onChange = { props.toggleHAProxyTaskRequest }
      />
    </div>
  );

  const frontend_mode = (
    <Input
      type = "select"
      label = "frontend_mode"
      value = { frontend_modeValue }
      onChange = { ( e ) => props.updateHAProxyForm( "frontend_mode"
                                                   , e.target.value
                                                   )
                 }
    >
      { createSimpleOptions( MODES ) }
    </Input>
  );

  const global_maxconn = (
    <Input
      type = "text"
      label = "global_maxconn"
      value = { global_maxconnValue }
      onChange = { ( e ) => props.updateHAProxyForm( "global_maxconn"
                                                   , e.target.value
                                                   )
                 }
    />
  );

  const defaults_maxconn = (
    <Input
      type = "text"
      label = "defaults_maxconn"
      value = { defaults_maxconnValue }
      onChange = { ( e ) => props.updateHAProxyForm( "defaults_maxconn"
                                                   , e.target.value
                                                   )
                 }
    />
  );

  const backend_mode = (
    <Input
      type = "select"
      label = "backend_mode"
      value = { backend_modeValue }
      onChange = { ( e ) => props.updateHAProxyForm( "backend_mode"
                                                   , e.target.value
                                                   )
                 }
    >
      { createSimpleOptions( MODES ) }
    </Input>
  );

  const http_ip = (
    <Input
      type = "text"
      label = "http_ip"
      value = { http_ipValue }
      onChange = { ( e ) => props.updateHAProxyForm( "http_ip"
                                                   , e.target.value
                                                   )
                 }
    />
  );

  const http_port = (
    <Input
      type = "text"
      label = "http_port"
      value = { http_portValue }
      onChange = { ( e ) => props.updateHAProxyForm( "http_port"
                                                   , e.target.value
                                                   )
                 }
    />
  );

  const https_ip = (
    <Input
      type = "text"
      label = "https_ip"
      value = { https_ipValue }
      onChange = { ( e ) => props.updateHAProxyForm( "https_ip"
                                                   , e.target.value
                                                   )
                 }
    />
  );

  const https_port = (
    <Input
      type = "text"
      label = "https_port"
      value = { https_portValue }
      onChange = { ( e ) => props.updateHAProxyForm( "https_port"
                                                   , e.target.value
                                                   )
                 }
    />
  );

  const formControlButtons = (
    <ButtonToolbar className = "pull-right">
      <Button
        bsStyle = "default"
        onClick = { props.resetHAProxyForm }
        disabled = { Object.keys( props.haproxyForm ).length === 0 }
      >
        { "Reset" }
      </Button>
      <Button
        bsStyle = "primary"
        onClick = { props.configureHAProxyTaskRequest }
        disabled = { Object.keys( props.haproxyForm ).length === 0 }
      >
        { "Apply" }
      </Button>
    </ButtonToolbar>
  );

  return (
    <Panel>
      <h4>{ "HAProxy" }</h4>
      { toggleService }
      <form className = "settings-config-form">
        { frontend_mode }
        { defaults_maxconn }
        { global_maxconn }
        { backend_mode }
        { http_ip }
        { http_port }
        { https_ip }
        { https_port }
        { formControlButtons }
      </form>
    </Panel>
  );
};

HAProxy.propTypes =
  { haproxyServerState: React.PropTypes.shape(
    { frontend_mode: React.PropTypes.oneOf( MODES )
    , defaults_maxconn:  React.PropTypes.number
    , https_port:  React.PropTypes.number
    , global_maxconn:  React.PropTypes.number
    , backend_mode: React.PropTypes.oneOf( MODES )
    , http_ip: React.PropTypes.string
    , http_port: React.PropTypes.number
    , https_ip: React.PropTypes.string
    , enable: React.PropTypes.bool
    }
  )
  , haproxyForm: React.PropTypes.shape(
    { frontend_mode: React.PropTypes.oneOf( MODES )
    , defaults_maxconn:  React.PropTypes.number
    , https_port:  React.PropTypes.number
    , global_maxconn:  React.PropTypes.number
    , backend_mode: React.PropTypes.oneOf( MODES )
    , http_ip: React.PropTypes.string
    , http_port: React.PropTypes.number
    , https_ip: React.PropTypes.string
    }
  )
  , updateHAProxyForm: React.PropTypes.func.isRequired
  , resetHAProxyForm: React.PropTypes.func.isRequired
  , configureHAProxyTaskRequest: React.PropTypes.func.isRequired
  , toggleHAProxyTaskRequest: React.PropTypes.func.isRequired
  };

export default HAProxy;
