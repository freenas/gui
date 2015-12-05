// Riak Configuration
// ==================

"use strict";

import React from "react";
import { Button, ButtonToolbar, Input, Panel } from "react-bootstrap";

import ToggleSwitch from "../../../components/ToggleSwitch";

const STORAGE_BACKEND_OPTIONS =
  [ "BITCASK"
  , "LEVELDB"
  , "MEMORY"
  , "MULTI"
  , "PREFIX_MULTI"
  ];

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

const Riak = ( props ) => {

  const listener_protobuf_internalValue = typeof props.riakForm.listener_protobuf_internal !== "undefined"
                                        ? props.riakForm.listener_protobuf_internal
                                        : props.riakServerState.listener_protobuf_internal;
  const nodenameValue = typeof props.riakForm.nodename !== "undefined"
                      ? props.riakForm.nodename
                      : props.riakServerState.nodename;
  const node_ipValue = typeof props.riakForm.node_ip !== "undefined"
                     ? props.riakForm.node_ip
                     : props.riakServerState.node_ip;
  const object_size_warning_thresholdValue = typeof props.riakForm.object_size_warning_threshold !== "undefined"
                                           ? props.riakForm.object_size_warning_threshold
                                           : props.riakServerState.object_size_warning_threshold;
  const storage_backendValue = typeof props.riakForm.storage_backend !== "undefined"
                             ? props.riakForm.storage_backend
                             : props.riakServerState.storage_backend;
  const save_descriptionValue = typeof props.riakForm.save_description !== "undefined"
                              ? props.riakForm.save_description
                              : props.riakServerState.save_description;
  const riak_controlValue = typeof props.riakForm.riak_control !== "undefined"
                          ? props.riakForm.riak_control
                          : props.riakServerState.riak_control;
  const listener_protobuf_internal_portValue = typeof props.riakForm.listener_protobuf_internal_port !== "undefined"
                                             ? props.riakForm.listener_protobuf_internal_port
                                             : props.riakServerState.listener_protobuf_internal_port;
  const log_console_levelValue = typeof props.riakForm.log_console_level !== "undefined"
                               ? props.riakForm.log_console_level
                               : props.riakServerState.log_console_level;
  const listener_http_internalValue = typeof props.riakForm.listener_http_internal !== "undefined"
                                    ? props.riakForm.listener_http_internal
                                    : props.riakServerState.listener_http_internal;
  const listener_http_internal_portValue = typeof props.riakForm.listener_http_internal_port !== "undefined"
                                         ? props.riakForm.listener_http_internal_port
                                         : props.riakServerState.listener_http_internal_port;
  const buckets_default_allow_multiValue = typeof props.riakForm.buckets_default_allow_multi !== "undefined"
                                         ? props.riakForm.buckets_default_allow_multi
                                         : props.riakServerState.buckets_default_allow_multi;
  const listener_https_internal_portValue = typeof props.riakForm.listener_https_internal_port !== "undefined"
                                          ? props.riakForm.listener_https_internal_port
                                          : props.riakServerState.listener_https_internal_port;
  const listener_https_internalValue = typeof props.riakForm.listener_https_internal !== "undefined"
                                     ? props.riakForm.listener_https_internal
                                     : props.riakServerState.listener_https_internal;
  const object_size_maximumValue = typeof props.riakForm.object_size_maximum !== "undefined"
                                 ? props.riakForm.object_size_maximum
                                 : props.riakServerState.object_size_maximum;


  const toggleService = (
    <div className = "pull-right" >
      <ToggleSwitch
        toggled = { props.riakServerState.enable }
        onChange = { props.toggleRiakTaskRequest }
      />
    </div>
  );

  const listener_protobuf_internal = (
    <Input
      type = "text"
      label = "listener_protobuf_internal"
      value = { listener_protobuf_internalValue }
      onChange = { ( e ) => props.updateRiakForm( "listener_protobuf_internal"
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
      onChange = { ( e ) => props.updateRiakForm( "nodename"
                                                , e.target.value
                                                )
                 }
    />
  );

  // TODO: Validate for IP
  const node_ip = (
    <Input
      type = "text"
      label = "node_ip"
      value = { node_ipValue }
      onChange = { ( e ) => props.updateRiakForm( "node_ip"
                                                , e.target.value
                                                )
                 }
    />
  );

  const object_size_warning_threshold = (
    <Input
      type = "text"
      label = "object_size_warning_threshold"
      value = { object_size_warning_thresholdValue }
      onChange = { ( e ) => props.updateRiakForm( "object_size_warning_threshold"
                                                , e.target.value
                                                )
                 }
    />
  );

  const storage_backend = (
    <Input
      type = "select"
      label = "storage_backend"
      value = { storage_backendValue }
      onChange = { ( e ) => props.updateRiakForm( "storage_backend"
                                                , e.target.value
                                                )
                 }
    >
      { createSimpleOptions( STORAGE_BACKEND_OPTIONS ) }
    </Input>
  );

  const save_description = (
    <Input
      type = "checkbox"
      label = "save_description"
      value = { save_descriptionValue }
      onChange = { ( e ) => props.updateRiakForm( "save_description"
                                                , e.target.checked
                                                )
                 }
    />
  );

  const riak_control = (
    <Input
      type = "checkbox"
      label = "riak_control"
      value = { riak_controlValue }
      onChange = { ( e ) => props.updateRiakForm( "riak_control"
                                                , e.target.checked
                                                )
                 }
    />
  );

  const listener_protobuf_internal_port = (
    <Input
      type = "text"
      label = "listener_protobuf_internal_port"
      value = { listener_protobuf_internal_portValue }
      onChange = { ( e ) => props.updateRiakForm( "listener_protobuf_internal_port"
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
      onChange = { ( e ) => props.updateRiakForm( "log_console_level"
                                                , e.target.value
                                                )
                 }
    >
      { createSimpleOptions( LOG_CONSOLE_LEVELS ) }
    </Input>
  );

  const listener_http_internal = (
    <Input
      type = "text"
      label = "listener_http_internal"
      value = { listener_http_internalValue }
      onChange = { ( e ) => props.updateRiakForm( "listener_http_internal"
                                                , e.target.value
                                                )
                 }
    />
  );

  const listener_http_internal_port = (
    <Input
      type = "text"
      label = "listener_http_internal_port"
      value = { listener_http_internal_portValue }
      onChange = { ( e ) => props.updateRiakForm( "listener_http_internal_port"
                                                , e.target.value
                                                )
                 }
    />
  );

  const buckets_default_allow_multi = (
    <Input
      type = "checkbox"
      label = "buckets_default_allow_multi"
      value = { buckets_default_allow_multiValue }
      onChange = { ( e ) => props.updateRiakForm( "buckets_default_allow_multi"
                                                , e.target.checked
                                                )
                 }
    />
  );

  const listener_https_internal_port = (
    <Input
      type = "text"
      label = "listener_https_internal_port"
      value = { listener_https_internal_portValue }
      onChange = { ( e ) => props.updateRiakForm( "listener_https_internal_port"
                                                , e.target.value
                                                )
                 }
    />
  );

  const listener_https_internal = (
    <Input
      type = "text"
      label = "listener_https_internal"
      value = { listener_https_internalValue }
      onChange = { ( e ) => props.updateRiakForm( "listener_https_internal"
                                                , e.target.value
                                                )
                 }
    />
  );

  const object_size_maximum = (
    <Input
      type = "text"
      label = "object_size_maximum"
      value = { object_size_maximumValue }
      onChange = { ( e ) => props.updateRiakForm( "object_size_maximum"
                                                , e.target.value
                                                )
                 }
    />
  );

  const formControlButtons = (
    <ButtonToolbar className = "pull-right">
      <Button
        bsStyle = "default"
        onClick = { props.resetRiakForm }
        disabled = { Object.keys( props.riakForm ).length === 0 }
      >
        { "Reset" }
      </Button>
      <Button
        bsStyle = "primary"
        onClick = { props.configureRiakTaskRequest }
        disabled = { Object.keys( props.riakForm ).length === 0 }
      >
        { "Apply" }
      </Button>
    </ButtonToolbar>
  );

  return (
    <Panel>
      <h4>{ "Riak" }</h4>
      { toggleService }
      <form className = "settings-config-form">
        { nodename }
        { node_ip }
        { listener_protobuf_internal }
        { listener_protobuf_internal_port }
        { listener_http_internal }
        { listener_http_internal_port }
        { listener_https_internal }
        { listener_https_internal_port }
        { object_size_maximum }
        { object_size_warning_threshold }
        { storage_backend }
        { log_console_level }
        { buckets_default_allow_multi }
        { riak_control }
        { save_description }
        { formControlButtons }
      </form>
    </Panel>
  );
};


Riak.propTypes =
  { riakServerState: React.PropTypes.shape(
    { enable: React.PropTypes.bool
    , listener_protobuf_internal: React.PropTypes.string
    , nodename: React.PropTypes.string
    , node_ip: React.PropTypes.string
    , object_size_warning_threshold: React.PropTypes.string
    , storage_backend: React.PropTypes.oneOf( STORAGE_BACKEND_OPTIONS )
    , save_description: React.PropTypes.bool
    , riak_control: React.PropTypes.bool
    , listener_protobuf_internal_port: React.PropTypes.oneOfType(
                                          [ React.PropTypes.number
                                          , React.PropTypes.string
                                          ]
                                        )
    , log_console_level: React.PropTypes.oneOf( LOG_CONSOLE_LEVELS )
    , listener_http_internal: React.PropTypes.string
    , listener_http_internal_port: React.PropTypes.oneOfType(
                                      [ React.PropTypes.number
                                      , React.PropTypes.string
                                      ]
                                    )
    , buckets_default_allow_multi: React.PropTypes.bool
    , listener_https_internal_port: React.PropTypes.oneOfType(
                                      [ React.PropTypes.number
                                      , React.PropTypes.string
                                      ]
                                    )
    , listener_https_internal: React.PropTypes.string
    , object_size_maximum: React.PropTypes.string
    }
  )
, riakForm: React.PropTypes.shape(
    { listener_protobuf_internal: React.PropTypes.string
    , nodename: React.PropTypes.string
    , node_ip: React.PropTypes.string
    , object_size_warning_threshold: React.PropTypes.string
    , storage_backend: React.PropTypes.oneOf( STORAGE_BACKEND_OPTIONS )
    , save_description: React.PropTypes.bool
    , riak_control: React.PropTypes.bool
    , listener_protobuf_internal_port: React.PropTypes.oneOfType(
                                          [ React.PropTypes.number
                                          , React.PropTypes.string
                                          ]
                                        )
    , log_console_level: React.PropTypes.oneOf( LOG_CONSOLE_LEVELS )
    , listener_http_internal: React.PropTypes.string
    , listener_http_internal_port: React.PropTypes.oneOfType(
                                      [ React.PropTypes.number
                                      , React.PropTypes.string
                                      ]
                                    )
    , buckets_default_allow_multi: React.PropTypes.bool
    , listener_https_internal_port: React.PropTypes.oneOfType(
                                      [ React.PropTypes.number
                                      , React.PropTypes.string
                                      ]
                                    )
    , listener_https_internal: React.PropTypes.string
    , object_size_maximum: React.PropTypes.string
    }
  )
  , updateRiakForm: React.PropTypes.func.isRequired
  , resetRiakForm: React.PropTypes.func.isRequired
  , configureRiakTaskRequest: React.PropTypes.func.isRequired
  , toggleRiakTaskRequest: React.PropTypes.func.isRequired
};

export default Riak;
