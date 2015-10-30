// SMB Configuration
// =================

"use strict";

import React from "react";
import { Button, ButtonToolbar, Input, Panel } from "react-bootstrap";

import ToggleSwitch from "../../../components/ToggleSwitch";

const PROTOCOLS = [ "CORE"
                  , "COREPLUS"
                  , "LANMAN1"
                  , "LANMAN2"
                  , "NT1"
                  , "SMB2"
                  , "SMB2_02"
                  , "SMB2_10"
                  , "SMB2_22"
                  , "SMB2_24"
                  , "SMB3"
                  , "SMB3_00"
                  ];

const LOG_LEVELS = [ "NONE"
                   , "MINIMUM"
                   , "NORMAL"
                   , "FULL"
                   , "DEBUG"
                   ];

const DOS_CHARSETS = [ "CP437"
                     , "CP850"
                     , "CP852"
                     , "CP866"
                     , "CP932"
                     , "CP949"
                     , "CP950"
                     , "CP1026"
                     , "CP1251"
                     ,"ASCII"
                     ];

const UNIX_CHARSETS = [ "UTF-8"
                      , "iso-8859-1"
                      , "iso-8859-15"
                      , "gb2312"
                      , "EUC-JP"
                      , "ASCII"
                      ];

function createDropdownOptions ( optionArray ) {
  var options =
    optionArray.map( function mapOptions ( optionValue, index ) {
                       return (
                         <option
                           value = { optionValue }
                           key = { index }>
                           { typeof optionValue === "string"
                           ? optionValue
                           : "------"
                           }
                         </option>
                       );
                     }
                   );
  return options;
};

const SMB = ( props ) => {

  const netbiosnameValue = typeof props.smbForm.netbiosname !== "undefined"
                         ? props.smbForm.netbiosname[ 0 ]
                         : props.smbServerState.netbiosname[ 0 ];
  const workgroupValue = typeof props.smbForm.workgroup !== "undefined"
                       ? props.smbForm.workgroup
                       : props.smbServerState.workgroup;
  const descriptionValue = typeof props.smbForm.description !== "undefined"
                         ? props.smbForm.description
                         : props.smbServerState.description;
  const dos_charsetValue = typeof props.smbForm.dos_charset !== "undefined"
                         ? props.smbForm.dos_charset
                         : props.smbServerState.dos_charset;
  const unix_charsetValue = typeof props.smbForm.unix_charset !== "undefined"
                          ? props.smbForm.unix_charset
                          : props.smbServerState.unix_charset;
  const log_levelValue = typeof props.smbForm.log_level !== "undefined"
                       ? props.smbForm.log_level
                       : props.smbServerState.log_level;
  const guest_userValue = typeof props.smbForm.guest_user !== "undefined"
                        ? props.smbForm.guest_user
                        : props.smbServerState.guest_user;
  const filemaskValue = typeof props.smbForm.filemask !== "undefined"
                      ? props.smbForm.filemask
                      : props.smbServerState.filemask;
  const dirmaskValue = typeof props.smbForm.dirmask !== "undefined"
                     ? props.smbForm.dirmask
                     : props.smbServerState.dirmask;
  const minProtocolValue = typeof props.smbForm.min_protocol !== "undefined"
                          ? props.smbForm.min_protocol
                          : props.smbServerState.min_protocol;
  const maxProtocolValue = typeof props.smbForm.max_protocol !== "undefined"
                          ? props.smbForm.max_protocol
                          : props.smbServerState.max_protocol;
  const bindAddressesValue = typeof props.smbForm.bind_addresses !== "undefined"
                            ? props.smbForm.bind_addresses
                            : props.smbServerState.bind_addresses;
  const syslogValue = typeof props.smbForm.syslog === "boolean"
                    ? props.smbForm.syslog
                    : props.smbServerState.syslog

  const local_masterValue = typeof props.smbForm.local_master === "boolean"
                          ? props.smbForm.local_master
                          : props.smbServerState.local_master

  const domain_logonsValue = typeof props.smbForm.domain_logons === "boolean"
                           ? props.smbForm.domain_logons
                           : props.smbServerState.domain_logons

  const time_serverValue = typeof props.smbForm.time_server === "boolean"
                         ? props.smbForm.time_server
                         : props.smbServerState.time_server

  const empty_passwordValue = typeof props.smbForm.empty_password === "boolean"
                            ? props.smbForm.empty_password
                            : props.smbServerState.empty_password

  const unixextValue = typeof props.smbForm.unixext === "boolean"
                     ? props.smbForm.unixext
                     : props.smbServerState.unixext

  const zeroconfValue = typeof props.smbForm.zeroconf === "boolean"
                      ? props.smbForm.zeroconf
                      : props.smbServerState.zeroconf

  const hostlookupValue = typeof props.smbForm.hostlookup === "boolean"
                        ? props.smbForm.hostlookup
                        : props.smbServerState.hostlookup

  const execute_alwaysValue = typeof props.smbForm.execute_always === "boolean"
                            ? props.smbForm.execute_always
                            : props.smbServerState.execute_always

  const obey_pam_restrictionsValue = typeof props.smbForm.obey_pam_restrictions === "boolean"
                                   ? props.smbForm.obey_pam_restrictions
                                   : props.smbServerState.obey_pam_restrictions


  const toggleService = (
    <div className = "pull-right" >
      <ToggleSwitch
        toggled = { props.smbServerState.enable }
        onChange = { props.toggleSMBTaskRequest }
      />
    </div>
  );

  const netbiosName = (
    <Input
      type = "text"
      label = "NetBIOS Name"
      value = { netbiosnameValue }
      onChange = { ( e ) => props.updateSMBForm( "netbiosname"
                                               , e.target.value
                                               )
                 }
    />
  );

  const workgroup = (
    <Input
      type = "text"
      label = "Workgroup"
      value = { workgroupValue }
      onChange = { ( e ) => props.updateSMBForm( "workgroup"
                                               , e.target.value
                                               )
                 }
    />
  );

  const description = (
    <Input
      type = "text"
      label = "Description"
      value = { descriptionValue }
      onChange = { ( e ) => props.updateSMBForm( "description"
                                               , e.target.value
                                               )
                 }
    />
  );

  const dosCharset = (
    <Input
      type = "select"
      label = "DOS Character Set"
      value = { dos_charsetValue }
      onChange = { ( e ) => props.updateSMBForm( "dos_charset"
                                                   , e.target.value
                                                   )
                     }
    >
      { createDropdownOptions( DOS_CHARSETS ) }
    </Input>
  );

  const unixCharset= (
    <Input
      type = "select"
      label = "Unix Character Set"
      value = { unix_charsetValue }
      onChange = { ( e ) => props.updateSMBForm( "unix_charset"
                                                   , e.target.value
                                                   )
                     }
    >
      { createDropdownOptions( UNIX_CHARSETS ) }
    </Input>
  );

  const logLevel = (
    <Input
      type = "select"
      label = "Log Level"
      value = { log_levelValue }
      onChange = { ( e ) => props.updateSMBForm( "log_level"
                                                   , e.target.value
                                                   )
                     }
    >
      { createDropdownOptions( LOG_LEVELS ) }
    </Input>
  );

  const syslog = (
    <Input
      type = "checkbox"
      label = "Use syslog"
      checked = { syslogValue }
      onChange = { ( e ) => props.updateSMBForm( "syslog"
                                               , e.target.checked
                                               )
                 }
    />
  );

  const localMaster = (
    <Input
      type = "checkbox"
      label = "Act as Local Master"
      checked = { local_masterValue }
      onChange = { ( e ) => props.updateSMBForm( "local_master"
                                               , e.target.checked
                                               )
                 }
    />
  );

  const domainLogons = (
    <Input
      type = "checkbox"
      label = "Domain Logons"
      checked = { domain_logonsValue }
      onChange = { ( e ) => props.updateSMBForm( "domain_logons"
                                               , e.target.checked
                                               )
                 }
    />
  );

  const timeServer= (
    <Input
      type = "checkbox"
      label = "Act as Time Server"
      checked = { time_serverValue }
      onChange = { ( e ) => props.updateSMBForm( "time_server"
                                               , e.target.checked
                                               )
                 }
    />
  );

  const guestUser = (
    <Input
      type = "select"
      label = "Guest User"
      value = { guest_userValue }
      onChange = { ( e ) => props.updateSMBForm( "guest_user"
                                                   , e.target.value
                                                   )
                     }
      disabled  // Need to be plumbed up to users
    >
      { /* createDropdownOptions( users ) */ }
    </Input>
  );

  const filemask = (
    <Input
      type = "text"
      label = "Default File Mask"
      value = { filemaskValue }
      onChange = { ( e ) => props.updateSMBForm( "filemask"
                                               , e.target.value
                                               )
                 }
      disabled // These need a different component
    />
  );

  const dirMask= (
    <Input
      type = "text"
      label = "Default Directory Mask"
      value = { dirmaskValue }
      onChange = { ( e ) => props.updateSMBForm( "dirmask"
                                               , e.target.value
                                               )
                 }
      disabled // These need a different component
    />
  );

  const emptyPassword = (
    <Input
      type = "checkbox"
      label = "Allow Empty Password"
      checked = { empty_passwordValue }
      onChange = { ( e ) => props.updateSMBForm( "empty_password"
                                               , e.target.checked
                                               )
                 }
    />
  );

  const unixExtensions = (
    <Input
      type = "checkbox"
      label = "Unix Extensions"
      checked = { unixextValue }
      onChange = { ( e ) => props.updateSMBForm( "unixext"
                                               , e.target.checked
                                               )
                 }
    />
  );

  const zeroconf = (
    <Input
      type = "checkbox"
      label = "Zeroconf share discovery"
      checked = { zeroconfValue }
      onChange = { ( e ) => props.updateSMBForm( "zeroconf"
                                               , e.target.checked
                                               )
                 }
    />
  );

  const hostnameLookup = (
    <Input
      type = "checkbox"
      label = "Use Hostname Lookups"
      checked = { hostlookupValue }
      onChange = { ( e ) => props.updateSMBForm( "hostlookup"
                                               , e.target.checked
                                               )
                 }
    />
  );

  // Minimum Protocol allows for none to be selected
  const MIN_PROTOCOL_CHOICES = PROTOCOLS.slice();
  MIN_PROTOCOL_CHOICES.unshift( null );

  const minProtocol = (
    <Input
      type = "select"
      label = "Minimum Protocol"
      value = { minProtocolValue }
      onChange = { ( e ) => props.updateSMBForm( "min_protocol"
                                                   , e.target.value
                                                   )
                     }
    >
      { createDropdownOptions( MIN_PROTOCOL_CHOICES) }
    </Input>
  );

  const maxProtocol= (
    <Input
      type = "select"
      label = "Maximum Protocol"
      value = { maxProtocolValue }
      onChange = { ( e ) => props.updateSMBForm( "max_protocol"
                                                   , e.target.value
                                                   )
                     }
    >
      { createDropdownOptions( PROTOCOLS ) }
    </Input>
  );

  const executeAlways= (
    <Input
      type = "checkbox"
      label = "Always Allow Execute"
      checked = { execute_alwaysValue }
      onChange = { ( e ) => props.updateSMBForm( "execute_always"
                                               , e.target.checked
                                               )
                 }
    />
  );

  const pamRestrictions = (
    <Input
      type = "checkbox"
      label = "Obey PAM Restrictions"
      checked = { obey_pam_restrictionsValue }
      onChange = { ( e ) => props.updateSMBForm( "obey_pam_restrictions"
                                               , e.target.checked
                                               )
                 }
    />
  );

  const bindAddresses = (
    <Input
      type = "select"
      label = "Bind IP Addresses"
      value = { bindAddressesValue }
      onChange = { ( e ) => props.updateSMBForm( "bind_addresses"
                                                   , e.target.value
                                                   )
                     }
      multiple
    >
      { /* createDropdownOptions( available IP addresses ) */ }
    </Input>
  );

  const formControlButtons = (
    <ButtonToolbar className = "pull-right">
      <Button
        bsStyle = "default"
        onClick = { props.resetSMBForm }
        disabled = { Object.keys( props.smbForm ).length === 0 }
      >
        { "Reset" }
      </Button>
      <Button
        bsStyle = "primary"
        onClick = { props.configureSMBTaskRequest }
        disabled = { Object.keys( props.smbForm ).length === 0 }
      >
        { "Apply" }
      </Button>
    </ButtonToolbar>
  );

  return (
    <Panel>
      <h4>{ "SMB" }</h4>
      { toggleService }
      <form className = "settings-config-form">
        { netbiosName /* Basic Field*/ }
        { workgroup /* Basic Field*/ }
        { description /* Basic Field*/ }
        { dosCharset /* Basic Field*/ }
        { unixCharset /* Basic Field*/ }
        { logLevel }
        { syslog }
        { localMaster }
        { domainLogons }
        { timeServer }
        { guestUser /* Basic Field*/ }
        { filemask }
        { dirMask }
        { emptyPassword }
        { unixExtensions }
        { zeroconf }
        { hostnameLookup }
        { minProtocol }
        { maxProtocol }
        { executeAlways }
        { pamRestrictions }
        { bindAddresses }
        { formControlButtons }
      </form>
    </Panel>
  );
};

SMB.propTypes = { sshServerState: React.PropTypes.shape(
                  { enable: React.PropTypes.bool
                  , dos_charset: React.PropTypes.oneOf( DOS_CHARSETS )
                  , filemask: React.PropTypes.string
                  , unix_charset: React.PropTypes.oneOf( UNIX_CHARSETS )
                  , domain_logons: React.PropTypes.bool
                  , max_protocol: React.PropTypes.oneOf( PROTOCOLS )
                  , netbiosname: React.PropTypes.arrayOf( React.PropTypes.string )
                  , empty_password: React.PropTypes.bool
                  , dirmask: React.PropTypes.string
                  , description: React.PropTypes.string
                  , log_level: React.PropTypes.oneOf( LOG_LEVELS )
                  , min_protocol: React.PropTypes.oneOf( PROTOCOLS )
                  , obey_pam_restrictions: React.PropTypes.bool
                  , workgroup: React.PropTypes.string
                  , time_server: React.PropTypes.bool
                  , guest_user: React.PropTypes.string
                  , local_master: React.PropTypes.bool
                  , hostlookup: React.PropTypes.bool
                  , syslog: React.PropTypes.bool
                  , zeroconf: React.PropTypes.bool
                  , execute_always: React.PropTypes.bool
                  , unixext: React.PropTypes.bool
                  , bind_addresses: React.PropTypes.arrayOf( React.PropTypes.string )
                  }
                  )
                , smbForm: React.PropTypes.shape(
                  { dos_charset: React.PropTypes.oneOf( DOS_CHARSETS )
                  , filemask: React.PropTypes.string
                  , unix_charset: React.PropTypes.oneOf( UNIX_CHARSETS )
                  , domain_logons: React.PropTypes.bool
                  , max_protocol: React.PropTypes.oneOf( PROTOCOLS )
                  , netbiosname: React.PropTypes.arrayOf( React.PropTypes.string )
                  , empty_password: React.PropTypes.bool
                  , dirmask: React.PropTypes.string
                  , description: React.PropTypes.string
                  , log_level: React.PropTypes.oneOf( LOG_LEVELS )
                  , min_protocol: React.PropTypes.oneOf( PROTOCOLS )
                  , obey_pam_restrictions: React.PropTypes.bool
                  , workgroup: React.PropTypes.string
                  , time_server: React.PropTypes.bool
                  , guest_user: React.PropTypes.string
                  , local_master: React.PropTypes.bool
                  , hostlookup: React.PropTypes.bool
                  , syslog: React.PropTypes.bool
                  , zeroconf: React.PropTypes.bool
                  , execute_always: React.PropTypes.bool
                  , unixext: React.PropTypes.bool
                  , bind_addresses: React.PropTypes.arrayOf( React.PropTypes.string )
                  }
                  )
                , updateSMBForm: React.PropTypes.func.isRequired
                , resetSMBForm: React.PropTypes.func.isRequired
                , configureSMBTaskRequest: React.PropTypes.func.isRequired
                , toggleSMBTaskRequest: React.PropTypes.func.isRequired
                };

export default SMB;
