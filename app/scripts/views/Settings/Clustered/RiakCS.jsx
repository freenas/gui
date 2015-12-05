// Riak CS Configuration
// =====================

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

const RiakCS = ( props ) => {

  const admin_secretValue = typeof props.riakCSForm.admin_secret !== "undefined"
                          ? props.riakCSForm.admin_secret
                          : props.riakCSServerState.admin_secret;
  const nodenameValue = typeof props.riakCSForm.nodename !== "undefined"
                      ? props.riakCSForm.nodename
                      : props.riakCSServerState.nodename;
  const node_ipValue = typeof props.riakCSForm.node_ip !== "undefined"
                     ? props.riakCSForm.node_ip
                     : props.riakCSServerState.node_ip;
  const stanchion_host_portValue = typeof props.riakCSForm.stanchion_host_port !== "undefined"
                                 ? props.riakCSForm.stanchion_host_port
                                 : props.riakCSServerState.stanchion_host_port;
  const admin_keyValue = typeof props.riakCSForm.admin_key !== "undefined"
                       ? props.riakCSForm.admin_key
                       : props.riakCSServerState.admin_key;
  const listener_portValue = typeof props.riakCSForm.listener_port !== "undefined"
                           ? props.riakCSForm.listener_port
                           : props.riakCSServerState.listener_port;
  const riak_host_ipValue = typeof props.riakCSForm.riak_host_ip !== "undefined"
                          ? props.riakCSForm.riak_host_ip
                          : props.riakCSServerState.riak_host_ip;
  const riak_host_portValue = typeof props.riakCSForm.riak_host_port !== "undefined"
                            ? props.riakCSForm.riak_host_port
                            : props.riakCSServerState.riak_host_port;
  const anonymous_user_creationValue = typeof props.riakCSForm.anonymous_user_creation !== "undefined"
                                     ? props.riakCSForm.anonymous_user_creation
                                     : props.riakCSServerState.anonymous_user_creation;
  const max_buckets_per_userValue = typeof props.riakCSForm.max_buckets_per_user !== "undefined"
                                  ? props.riakCSForm.max_buckets_per_user
                                  : props.riakCSServerState.max_buckets_per_user;
  const log_console_levelValue = typeof props.riakCSForm.log_console_level !== "undefined"
                               ? props.riakCSForm.log_console_level
                               : props.riakCSServerState.log_console_level;
  const stanchion_host_ipValue = typeof props.riakCSForm.stanchion_host_ip !== "undefined"
                               ? props.riakCSForm.stanchion_host_ip
                               : props.riakCSServerState.stanchion_host_ip;
  const listener_ipValue = typeof props.riakCSForm.listener_ip !== "undefined"
                         ? props.riakCSForm.listener_ip
                         : props.riakCSServerState.listener_ip;

  const toggleService = (
    <div className = "pull-right" >
      <ToggleSwitch
        toggled = { props.riakCSServerState.enable }
        onChange = { props.toggleRiakCSTaskRequest }
      />
    </div>
  );

  const admin_secret = (
    <Input
      type = "text"
      label = "admin_secret"
      value = { admin_secretValue }
      onChange = { ( e ) => props.updateRiakCSForm( "admin_secret"
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
      onChange = { ( e ) => props.updateRiakCSForm( "nodename"
                                                  , e.target.value
                                                  )
                 }
    />
  );

  const node_ip = (
    <Input
      type = "text"
      label = "Node Address"
      value = { node_ipValue }
      onChange = { ( e ) => props.updateRiakCSForm( "node_ip"
                                                  , e.target.value
                                                  )
                 }
    />
  );

  const stanchion_host_port = (
    <Input
      type = "text"
      label = "stanchion_host_port"
      value = { stanchion_host_portValue }
      onChange = { ( e ) => props.updateRiakCSForm( "stanchion_host_port"
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
      onChange = { ( e ) => props.updateRiakCSForm( "admin_key"
                                                  , e.target.value
                                                  )
                 }
    />
  );

  const listener_port = (
    <Input
      type = "text"
      label = "listener_port"
      value = { listener_portValue }
      onChange = { ( e ) => props.updateRiakCSForm( "listener_port"
                                                  , e.target.value
                                                  )
                 }
    />
  );

  const riak_host_ip = (
    <Input
      type = "text"
      label = "riak_host_ip"
      value = { riak_host_ipValue }
      onChange = { ( e ) => props.updateRiakCSForm( "riak_host_ip"
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
      onChange = { ( e ) => props.updateRiakCSForm( "riak_host_port"
                                                  , e.target.value
                                                  )
                 }
    />
  );

  const anonymous_user_creation = (
    <Input
      type = "checkbox"
      label = "anonymous_user_creation"
      checked = { anonymous_user_creationValue }
      onChange = { ( e ) => props.updateRiakCSForm( "anonymous_user_creation"
                                                  , e.target.checked
                                                  )
                 }
    />
  );

  const max_buckets_per_user = (
    <Input
      type = "text"
      label = "max_buckets_per_user"
      value = { max_buckets_per_userValue }
      onChange = { ( e ) => props.updateRiakCSForm( "max_buckets_per_user"
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
      onChange = { ( e ) => props.updateRiakCSForm( "log_console_level"
                                                  , e.target.value
                                                  )
                 }
    >
      { createSimpleOptions( LOG_CONSOLE_LEVELS ) }
    </Input>
  );

  const stanchion_host_ip = (
    <Input
      type = "text"
      label = "stanchion_host_ip"
      value = { stanchion_host_ipValue }
      onChange = { ( e ) => props.updateRiakCSForm( "stanchion_host_ip"
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
      onChange = { ( e ) => props.updateRiakCSForm( "listener_ip"
                                                  , e.target.value
                                                  )
                 }
    />
  );

  const formControlButtons = (
    <ButtonToolbar className = "pull-right">
      <Button
        bsStyle = "default"
        onClick = { props.resetRiakCSForm }
        disabled = { Object.keys( props.riakCSForm ).length === 0 }
      >
        { "Reset" }
      </Button>
      <Button
        bsStyle = "primary"
        onClick = { props.configureRiakCSTaskRequest }
        disabled = { Object.keys( props.riakCSForm ).length === 0 }
      >
        { "Apply" }
      </Button>
    </ButtonToolbar>
  );


  return (
    <Panel>
      <h4>{ "Riak CS" }</h4>
      { toggleService }
      <form className = "settings-config-form">
        { nodename }
        { node_ip }
        { listener_ip }
        { listener_port }
        { riak_host_ip }
        { riak_host_port }
        { stanchion_host_ip }
        { stanchion_host_port }
        { max_buckets_per_user }
        { admin_key }
        { admin_secret }
        { log_console_level }
        { anonymous_user_creation }
        { formControlButtons }
      </form>
    </Panel>
  );
}


RiakCS.propTypes = {
  riakCSServerState: React.PropTypes.shape(
    { enabled: React.PropTypes.bool
    , admin_secret: React.PropTypes.string
    , nodename: React.PropTypes.string
    , node_ip: React.PropTypes.string
    , stanchion_host_port: React.PropTypes.oneOfType(
                                          [ React.PropTypes.number
                                          , React.PropTypes.string
                                          ]
                                        )
    , admin_key: React.PropTypes.string
    , listener_port: React.PropTypes.oneOfType(
                                          [ React.PropTypes.number
                                          , React.PropTypes.string
                                          ]
                                        )
    , riak_host_ip: React.PropTypes.string
    , riak_host_port: React.PropTypes.oneOfType(
                                          [ React.PropTypes.number
                                          , React.PropTypes.string
                                          ]
                                        )
    , anonymous_user_creation: React.PropTypes.bool
    , max_buckets_per_user: React.PropTypes.oneOfType(
                                          [ React.PropTypes.number
                                          , React.PropTypes.string
                                          ]
                                        )
    , log_console_level: React.PropTypes.oneOf( LOG_CONSOLE_LEVELS )
    , stanchion_host_ip: React.PropTypes.string
    , listener_ip: React.PropTypes.string
    }
  )
  , riakCSForm: React.PropTypes.shape(
    { admin_secret: React.PropTypes.string
    , nodename: React.PropTypes.string
    , node_ip: React.PropTypes.string
    , stanchion_host_port: React.PropTypes.oneOfType(
                                          [ React.PropTypes.number
                                          , React.PropTypes.string
                                          ]
                                        )
    , admin_key: React.PropTypes.string
    , listener_port: React.PropTypes.oneOfType(
                                          [ React.PropTypes.number
                                          , React.PropTypes.string
                                          ]
                                        )
    , riak_host_ip: React.PropTypes.string
    , riak_host_port: React.PropTypes.oneOfType(
                                          [ React.PropTypes.number
                                          , React.PropTypes.string
                                          ]
                                        )
    , anonymous_user_creation: React.PropTypes.bool
    , max_buckets_per_user: React.PropTypes.oneOfType(
                                          [ React.PropTypes.number
                                          , React.PropTypes.string
                                          ]
                                        )
    , log_console_level: React.PropTypes.oneOf( LOG_CONSOLE_LEVELS )
    , stanchion_host_ip: React.PropTypes.string
    , listener_ip: React.PropTypes.string
    }
  )
  , updateRiakCSForm: React.PropTypes.func.isRequired
  , resetRiakCSForm: React.PropTypes.func.isRequired
  , configureRiakCSTaskRequest: React.PropTypes.func.isRequired
  , toggleRiakCSTaskRequest: React.PropTypes.func.isRequired
};

export default RiakCS;
