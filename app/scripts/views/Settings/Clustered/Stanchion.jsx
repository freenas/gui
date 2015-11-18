// Stanchion Configuration
// =======================

"use strict";

import React from "react";
import { Button, ButtonToolbar, Input, Panel } from "react-bootstrap";

import ToggleSwitch from "../../../components/ToggleSwitch";

const LOG_CONSOLE_LEVELS =
  [ "NONE"
  , "DEBUG"
  , "INFO"
  , "WARNING"
  , "CRITICAL"
  , "ALERT"
  , "EMERGENCY"
  , "ERROR"
  ];

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

const Stanchion = ( props ) => {

  const riak_host_ipValue = typeof props.stanchionForm.riak_host_ip !== "undefined"
                          ? props.stanchionForm.riak_host_ip
                          : props.stanchionServerState.riak_host_ip;
  const admin_secretValue = typeof props.stanchionForm.admin_secret !== "undefined"
                          ? props.stanchionForm.admin_secret
                          : props.stanchionServerState.admin_secret;
  const riak_host_portValue = typeof props.stanchionForm.riak_host_port !== "undefined"
                            ? props.stanchionForm.riak_host_port
                            : props.stanchionServerState.riak_host_port;
  const nodenameValue = typeof props.stanchionForm.nodename !== "undefined"
                      ? props.stanchionForm.nodename
                      : props.stanchionServerState.nodename;
  const node_ipValue = typeof props.stanchionForm.node_ip !== "undefined"
                     ? props.stanchionForm.node_ip
                     : props.stanchionServerState.node_ip;
  const admin_keyValue = typeof props.stanchionForm.admin_key !== "undefined"
                       ? props.stanchionForm.admin_key
                       : props.stanchionServerState.admin_key;
  const log_console_levelValue = typeof props.stanchionForm.log_console_level !== "undefined"
                               ? props.stanchionForm.log_console_level
                               : props.stanchionServerState.log_console_level;
  const listener_portValue = typeof props.stanchionForm.listener_port !== "undefined"
                           ? props.stanchionForm.listener_port
                           : props.stanchionServerState.listener_port;
  const listener_ipValue = typeof props.stanchionForm.listener_ip !== "undefined"
                         ? props.stanchionForm.listener_ip
                         : props.stanchionServerState.listener_ip;

  const toggleService = (
    <div className = "pull-right" >
      <ToggleSwitch
        toggled = { props.stanchionServerState.enable }
        onChange = { props.toggleStanchionTaskRequest }
      />
    </div>
  );


  const riak_host_ip = (
    <Input
      type = "text"
      label = "riak_host_ip"
      value = { riak_host_ipValue }
      onChange = { ( e ) => props.updateStanchionForm( "riak_host_ip"
                                                     , e.target.value
                                                     )
                 }
    />
  );

  const admin_secret = (
    <Input
      type = "text"
      label = "admin_secret"
      value = { admin_secretValue }
      onChange = { ( e ) => props.updateStanchionForm( "admin_secret"
                                                     , e.target.value
                                                     )
                 }
    />
  );

  const riak_host_port = (
    <Input
      type = "text"
      label = "riak_host_port"
      value = { riak_host_portValue }
      onChange = { ( e ) => props.updateStanchionForm( "riak_host_port"
                                                     , e.target.value
                                                     )
                 }
    />
  );

  const nodename = (
    <Input
      type = "text"
      label = "nodename"
      value = { nodenameValue }
      onChange = { ( e ) => props.updateStanchionForm( "nodename"
                                                     , e.target.value
                                                     )
                 }
    />
  );

  const node_ip = (
    <Input
      type = "text"
      label = "node_ip"
      value = { node_ipValue }
      onChange = { ( e ) => props.updateStanchionForm( "node_ip"
                                                     , e.target.value
                                                     )
                 }
    />
  );

  const admin_key = (
    <Input
      type = "text"
      label = "admin_key"
      value = { admin_keyValue }
      onChange = { ( e ) => props.updateStanchionForm( "admin_key"
                                                     , e.target.value
                                                     )
                 }
    />
  );

  const log_console_level = (
    <Input
      type = "select"
      label = "log_console_level"
      value = { log_console_levelValue }
      onChange = { ( e ) => props.updateStanchionForm( "log_console_level"
                                                     , e.target.value
                                                     )
                 }
    >
      { createSimpleOptions( LOG_CONSOLE_LEVELS ) }
    </Input>
  );

  const listener_port = (
    <Input
      type = "text"
      label = "listener_port"
      value = { listener_portValue }
      onChange = { ( e ) => props.updateStanchionForm( "listener_port"
                                                     , e.target.value
                                                     )
                 }
    />
  );

  const listener_ip = (
    <Input
      type = "text"
      label = "listener_ip"
      value = { listener_ipValue }
      onChange = { ( e ) => props.updateStanchionForm( "listener_ip"
                                                     , e.target.value
                                                     )
                 }
    />
  );

  const formControlButtons = (
    <ButtonToolbar className = "pull-right">
      <Button
        bsStyle = "default"
        onClick = { props.resetStanchionForm }
        disabled = { Object.keys( props.stanchionForm ).length === 0 }
      >
        { "Reset" }
      </Button>
      <Button
        bsStyle = "primary"
        onClick = { props.configureRiakCSTaskRequest }
        disabled = { Object.keys( props.stanchionForm ).length === 0 }
      >
        { "Apply" }
      </Button>
    </ButtonToolbar>
  );

  return (
    <Panel>
      <h4>{ "Stanchion" }</h4>
      { toggleService }
      <form className = "settings-config-form">
        { riak_host_ip }
        { admin_secret }
        { riak_host_port }
        { nodename }
        { node_ip }
        { admin_key }
        { log_console_level }
        { listener_port }
        { listener_ip }
        { formControlButtons }
      </form>
    </Panel>
  );

}

Stanchion.propTypes =
  { stanchionServerState: React.PropTypes.shape(
    { enable: React.PropTypes.bool
    , riak_host_ip: React.PropTypes.string
    , admin_secret: React.PropTypes.string
    , riak_host_port: React.PropTypes.oneOfType(
      [ React.PropTypes.number
      , React.PropTypes.string
      ]
    )
    , nodename: React.PropTypes.string
    , node_ip: React.PropTypes.string
    , admin_key: React.PropTypes.string
    ,log_console_level: React.PropTypes.oneOf( LOG_CONSOLE_LEVELS )
    , listener_port: React.PropTypes.oneOfType(
      [ React.PropTypes.number
      , React.PropTypes.string
      ]
    )
    , listener_ip: React.PropTypes.string
  }
  )
  , stanchionForm: React.PropTypes.shape(
    { riak_host_ip: React.PropTypes.string
    , admin_secret: React.PropTypes.string
    , riak_host_port: React.PropTypes.oneOfType(
      [ React.PropTypes.number
      , React.PropTypes.string
      ]
    )
    , nodename: React.PropTypes.string
    , node_ip: React.PropTypes.string
    , admin_key: React.PropTypes.string
    ,log_console_level: React.PropTypes.oneOf( LOG_CONSOLE_LEVELS )
    , listener_port: React.PropTypes.oneOfType(
      [ React.PropTypes.number
      , React.PropTypes.string
      ]
    )
    , listener_ip: React.PropTypes.string
  }
  )
  , updateStanchionForm: React.PropTypes.func.isRequired
  , resetStanchionForm: React.PropTypes.func.isRequired
  , configureStanchionTaskRequest: React.PropTypes.func.isRequired
  , toggleStanchionTaskRequest: React.PropTypes.func.isRequired
};

export default Stanchion;
