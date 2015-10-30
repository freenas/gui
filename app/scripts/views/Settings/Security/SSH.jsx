// SSH Configuration
// =================

"use strict";

import React from "react";
import { Button, ButtonToolbar, Input, Panel } from "react-bootstrap";

import ToggleSwitch from "../../../components/ToggleSwitch";

// TODO: get these from the schema
const LOG_LEVELS = [ "QUIET"
                   , "FATAL"
                   , "ERROR"
                   , "INFO"
                   , "VERBOSE"
                   , "DEBUG"
                   , "DEBUG2"
                   , "DEBUG3"
                   ];

const LOG_FACILITIES = [ "DAEMON"
                       , "USER"
                       , "AUTH"
                       , "LOCAL0"
                       , "LOCAL1"
                       , "LOCAL2"
                       , "LOCAL3"
                       , "LOCAL4"
                       , "LOCAL5"
                       , "LOCAL6"
                       , "LOCAL7"
                       ];

function createDropdownOptions ( optionArray ) {
  var options =
    optionArray.map( function mapOptions ( optionValue, index ) {
                       return (
                         <option
                           value = { optionValue }
                           key = { index }>
                           { optionValue }
                         </option>
                       );
                     }
                   );
  return options;
}

const SSH = ( props ) => {

  const sftpLogFacilityValue = typeof props.sshForm.sftp_log_facility
                           !== "undefined"
                             ? props.sshForm.sftp_log_facility
                             : props.sshServerState.sftp_log_facility;
  const permitRootLoginValue = typeof props.sshForm.permit_root_login
                           !== "undefined"
                             ? props.sshForm.permit_root_login
                             : props.sshServerState.permit_root_login;
  const compressionValue = typeof props.sshForm.compression
                       !== "undefined"
                         ? props.sshForm.compression
                         : props.sshServerState.compression;
  const sftpLogLevelValue = typeof props.sshForm.sftp_log_level
                        !== "undefined"
                          ? props.sshForm.sftp_log_level
                          : props.sshServerState.sftp_log_level;
  const allowPasswordAuthValue = typeof props.sshForm.allow_password_auth
                             !== "undefined"
                               ? props.sshForm.allow_password_auth
                               : props.sshServerState.allow_password_auth;
  const allowPortForwardingValue = typeof props.sshForm.allow_port_forwarding
                               !== "undefined"
                                 ? props.sshForm.allow_port_forwarding
                                 : props.sshServerState.allow_port_forwarding;
  const portValue = typeof props.sshForm.port
                !== "undefined"
                  ? props.sshForm.port
                  : props.sshServerState.port;

  const toggleService = (
    <div className = "pull-right" >
      <ToggleSwitch
        toggled = { props.sshServerState.enable }
        onChange = { props.toggleSSHTaskRequest }
      />
    </div>
  );

  const port = (
    <Input
      type = "text"
      label = "TCP Port"
      value = { portValue }
      onChange = { ( e ) => props.updateSSHForm( "port", e.target.value ) }
      />
    );

  const allowPortForwarding = (
    <Input
      type = "checkbox"
      label = "TCP Port Forwarding"
      checked = { allowPortForwardingValue }
      onChange = { ( e ) => props.updateSSHForm( "allow_port_forwarding"
                                               , e.target.checked
                                               )
                 }
    />
  );

  const permitRootLogin = (
    <Input
      type = "checkbox"
      label = "Login as root with password"
      checked = { permitRootLoginValue }
      onChange = { ( e ) => props.updateSSHForm( "permit_root_login"
                                               , e.target.checked
                                               )
                 }
    />
  );

  const allowPasswordAuth = (
    <Input
      type = "checkbox"
      label = "Allow Password Authentication"
      checked = { allowPasswordAuthValue }
      onChange = { ( e ) => props.updateSSHForm( "allow_password_auth"
                                               , e.target.checked
                                               )
                 }
    />
  );

  const compression = (
    <Input
      type = "checkbox"
      label = "Compress Connection"
      checked = { compression }
      onChange = { ( e ) => props.updateSSHForm( "compression"
                                               , e.target.checked
                                               )
                 }
    />
  );

  const sftpLogLevel = (
    <Input
      type = "select"
      label = "SFTP Log Level"
      value = { sftpLogLevelValue }
      onChange = { ( e ) => props.updateSSHForm( "sftp_log_level"
                                               , e.target.value
                                               )
                 }
    >
      { createDropdownOptions( LOG_LEVELS ) }
    </Input>
  );

  const sftpLogFacility = (
    <Input
      type = "select"
      label = "SFTP Log Facility"
      value = { sftpLogFacilityValue }
      onChange = { ( e ) => props.updateSSHForm( "sftp_log_facility"
                                               , e.target.value
                                               )
                 }
    >
      { createDropdownOptions( LOG_FACILITIES ) }
    </Input>
  );

  const formControlButtons = (
    <ButtonToolbar className = "pull-right">
      <Button
        bsStyle = "default"
        onClick = { props.resetSSHForm }
        disabled = { Object.keys( props.sshForm ).length === 0 }
      >
        { "Reset" }
      </Button>
      <Button
        bsStyle = "primary"
        onClick = { props.configureSSHTaskRequest }
        disabled = { Object.keys( props.sshForm ).length === 0 }
      >
        { "Apply" }
      </Button>
    </ButtonToolbar>
  );

  return (
    <Panel>
      <h4>SSH</h4>
      { toggleService }
      <form className = "settings-config-form">
        { port }
        { allowPortForwarding }
        { permitRootLogin }
        { allowPasswordAuth }
        { compression }
        { sftpLogLevel }
        { sftpLogFacility }
        { formControlButtons }
      </form>
    </Panel>
  );
};

SSH.propTypes = { sshServerState: React.PropTypes.shape(
                  { sftp_log_facility: React.PropTypes.oneOf( LOG_FACILITIES )
                  , permit_root_login: React.PropTypes.bool
                  , compression: React.PropTypes.bool
                  , sftp_log_level: React.PropTypes.oneOf( LOG_LEVELS )
                  , allow_password_auth: React.PropTypes.bool
                  , allow_port_forwarding: React.PropTypes.bool
                  , port: React.PropTypes.number
                  , enable: React.PropTypes.enable
                  }
                )
                , sshForm: React.PropTypes.shape(
                  { sftp_log_facility: React.PropTypes.oneOf( LOG_FACILITIES )
                  , permit_root_login: React.PropTypes.bool
                  , compression: React.PropTypes.bool
                  , sftp_log_level: React.PropTypes.oneOf( LOG_LEVELS )
                  , allow_password_auth: React.PropTypes.bool
                  , allow_port_forwarding: React.PropTypes.bool
                  , port: React.PropTypes.oneOfType( [ React.PropTypes.number
                                                     , React.PropTypes.string
                                                     ]
                                                   )
                  }
                )
                , sshConfigRequests: React.PropTypes.instanceOf( Set )
                , updateSSHForm: React.PropTypes.func.isRequired
                , resetSSHForm: React.PropTypes.func.isRequired
                , configureSSHTaskRequest: React.PropTypes.func.isRequired
                , toggleSSHTaskRequest: React.PropTypes.func.isRequired
                };

export default SSH;
