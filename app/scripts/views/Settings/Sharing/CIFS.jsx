// CIFS Configuration
// ==================

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
}

export default class CIFS extends React.Component {
  constructor ( props ) {
    super( props );
  }

  render () {

    const toggleService = (
      <div className = "pull-right" >
        <ToggleSwitch
          toggled = { true }
        />
      </div>
    );

    const netbiosName = (
      <Input
        type = "text"
        label = "NetBIOS Name"
        value = { this.props.netbiosname }
      />
    );

    const workgroup = (
      <Input
        type = "text"
        label = "Workgroup"
        value = { this.props.workgroup }
      />
    );

    const description = (
      <Input
        type = "text"
        label = "Description"
        value = { this.props.description }
      />
    );

    const dosCharset = (
      <Input
        type = "select"
        label = "DOS Character Set"
        value = { this.props.dos_charset }
      >
        { createDropdownOptions( DOS_CHARSETS ) }
      </Input>
    );

    const unixCharset= (
      <Input
        type = "select"
        label = "Unix Character Set"
        value = { this.props.unix_charset }
      >
        { createDropdownOptions( UNIX_CHARSETS ) }
      </Input>
    );

    const logLevel = (
      <Input
        type = "select"
        label = "Log Level"
        value = { this.props.log_level }
      >
        { createDropdownOptions( LOG_LEVELS ) }
      </Input>
    );

    const syslog = (
      <Input
        type = "checkbox"
        label = "Use syslog"
        checked = { this.props.syslog }
      />
    );

    const localMaster = (
      <Input
        type = "checkbox"
        label = "Act as Local Master"
        checked = { this.props.local_master }
      />
    );

    const domainLogons = (
      <Input
        type = "checkbox"
        label = "Domain Logons"
        checked = { this.props.domain_logons }
      />
    );

    const timeServer= (
      <Input
        type = "checkbox"
        label = "Act as Time Server"
        checked = { this.props.time_server }
      />
    );

    const guestUser = (
      <Input
        type = "select"
        label = "Guest User"
        value = { this.props.guest_user }
      >
        { /* createDropdownOptions( users ) */ }
      </Input>
    );

    const filemask = (
      <Input
        type = "text"
        label = "Default File Mask"
        value = { this.props.filemask }
      />
    );

    const dirMask= (
      <Input
        type = "text"
        label = "Default Directory Mask"
        value = { this.props.dirmask }
      />
    );

    const emptyPassword = (
      <Input
        type = "checkbox"
        label = "Allow Empty Password"
        checked = { this.props.empty_password }
      />
    );

    const unixExtensions = (
      <Input
        type = "checkbox"
        label = "Unix Extensions"
        checked = { this.props.unixext }
      />
    );

    const zeroconf = (
      <Input
        type = "checkbox"
        label = "Zeroconf share discovery"
        checked = { this.props.zeroconf }
      />
    );

    const hostnameLookup = (
      <Input
        type = "checkbox"
        label = "Use Hostname Lookups"
        checked = { this.props.hostlookup }
      />
    );

    // Minimum Protocol allows for none to be selected
    const MIN_PROTOCOL_CHOICES = PROTOCOLS.slice();
    MIN_PROTOCOL_CHOICES.unshift( null );

    const minProtocol = (
      <Input
        type = "select"
        label = "Minimum Protocol"
        value = { this.props.min_protocol }
      >
        { createDropdownOptions( MIN_PROTOCOL_CHOICES) }
      </Input>
    );

    const maxProtocol= (
      <Input
        type = "select"
        label = "Maximum Protocol"
        value = { this.props.max_protocol }
      >
        { createDropdownOptions( PROTOCOLS ) }
      </Input>
    );

    const executeAlways= (
      <Input
        type = "checkbox"
        label = "Always Allow Execute"
        checked = { this.props.execute_always }
      />
    );

    const pamRestrictions = (
      <Input
        type = "checkbox"
        label = "Obey PAM Restrictions"
        checked = { this.props.obey_pam_restrictions }
      />
    );

    const bindAddresses = (
      <Input
        type = "select"
        label = "Bind IP Addresses"
        value = { this.props.bind_addresses }
        multiple
      >
        { /* createDropdownOptions( available IP addresses ) */ }
      </Input>
    );

    const formControlButtons = (
      <ButtonToolbar className = "pull-right">
        <Button
          bsStyle = "default"
        >
          { "Reset" }
        </Button>
        <Button
          bsStyle = "primary"
        >
          { "Apply" }
        </Button>
      </ButtonToolbar>
    );

    return (
      <Panel>
        <h4>CIFS</h4>
        { toggleService }
        <form className = "settings-config-form">
          { netbiosName }
          { workgroup }
          { description }
          { dosCharset }
          { unixCharset }
          { logLevel }
          { syslog }
          { localMaster }
          { domainLogons }
          { timeServer }
          { guestUser }
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
  }
};

CIFS.propTypes = { dos_charset: React.PropTypes.string
                 , filemask: React.PropTypes.string
                 , unix_charset: React.PropTypes.string
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
                 , sid: React.PropTypes.string // I have no idea what this is
                 , time_server: React.PropTypes.bool
                 , guest_user: React.PropTypes.string
                 , local_master: React.PropTypes.bool
                 , hostlookup: React.PropTypes.bool
                 , syslog: React.PropTypes.bool
                 , zeroconf: React.PropTypes.bool
                 , execute_always: React.PropTypes.bool
                 , unixext: React.PropTypes.bool
                 , bind_addresses: React.PropTypes.arrayOf( React.PropTypes.string )
                 };
