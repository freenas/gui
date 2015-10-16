// FTP Configuration
// ==================

"use strict";

import React from "react";
import { Button, ButtonToolbar, Input, Panel } from "react-bootstrap";

import ToggleSwitch from "../../../components/ToggleSwitch";

const TLS_POLICIES = [ "ON"
                     , "OFF"
                     , "DATA"
                     , "!DATA"
                     , "AUTH"
                     , "CTRL"
                     , "CTRL+DATA"
                     , "CTRL+!DATA"
                     , "AUTH+DATA"
                     , "AUTH+!DATA"
                     ];

const TLS_OPTIONS = [ "ALLOW_CLIENT_RENEGOTIATIONS"
                    , "ALLOW_DOT_LOGIN"
                    , "ALLOW_PER_USER"
                    , "COMMON_NAME_REQUIRED"
                    , "ENABLE_DIAGNOSTICS"
                    , "EXPORT_CERTIFICATE_DATA"
                    , "NO_CERTIFICATE_REQUEST"
                    , "NO_EMPTY_FRAGMENTS"
                    , "NO_SESSION_REUSE_REQUIRED"
                    , "STANDARD_ENV_VARS"
                    , "DNS_NAME_REQUIRED"
                    , "IP_ADDRESS_REQUIRED"
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

export default class FTP extends React.Component {
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

    const port = (
      <Input
        type =  "text"
        label = "Port"
        value = { this.props.port }
      />
    );

    const maxClients = (
      <Input
        type = "text"
        label = "Maximum Concurrent Clients"
        value = { this.props.max_clients }
      />
    );

    const ipConnections = (
      <Input
        type = "text"
        label = "Maximum Connections"
        value = { this.props.ip_connections }
      />
    );

    const loginAttempts = (
      <Input
        type = "text"
        label = "Maximum Login Attempts"
        value = { this.props.login_attempt }
      />
    );

    const timeout = (
      <Input
        type = "text"
        label = "Timeout"
        value = { this.props.timeout }
      />
    );

    const allowRoot = (
      <Input
        type = "checkbox"
        label = "Allow Root Login"
        checked = { this.props.root_login }
      />
    );

    const localOnly = (
      <Input
        type = "checkbox"
        label = "Only Allow Local Users"
        checked = { this.props.only_local }
      />
    );

    const onlyAnonymous = (
      <Input
        type = "checkbox"
        label = "Only Allow Anonymous Login"
        checked = { this.props.only_anonymous }
      />
    );

    // This should be a dataset selection widget
    /*const anonPath = (
      <Input
        type =
        label =
        value = { this.props.anonymous_path }
      />
    );*/

    const loginMessage =  (
      <Input
        type = "textarea"
        label = "Login Message"
        value = { this.props.display_login }
      />
    );

    // This should be a permissions widget
    /* const defaultFilemask = (
      <Input
        type = "text"
        label = "Default File Permissions"
        value = { this.props.filemask }
      />
    );*/

    // This scould be a dataset selection widget
    /* const defaultDirmask = (
      <Input
        type =
        label =
        value = { this.props.dirmask }
      />
    );*/

    const fxp = (
      <Input
        type = "checkbox"
        label = "Enable FXP"
        checked = { this.props.fxp }
      />
    );

    const resumeTransfer = (
      <Input
        type = "checkbox"
        label = "Allow Transfer Resumption"
        checked = { this.props.resume }
      />
    );

    const chroot = (
      <Input
        type = "checkbox"
        label = "Always Chroot"
        checked = { this.props.chroot }
      />
    );

    const requireIdent = (
      <Input
        type = "checkbox"
        label = "Require IDENT Authentication"
        checked = { this.props.ident }
      />
    );

    const reverseDNS = (
      <Input
        type = "text"
        label = "Perform Reverse DNS Lookup"
        value = { this.props.reverse_dns }
      />
    );

    const masqueradeAddress = (
      <Input
        type = "text"
        label = "masquerade Address"
        value = { this.props.masquerade_address }
      />
    );

    const minPassivePort= (
      <Input
        type = "text"
        label = "Minimum Passive Port"
        value = { this.props.passive_ports_min }
      />
    );

    const maxPassivePort = (
      <Input
        type = "text"
        label = "Maximum Passive Port"
        value = { this.props.passive_ports_max }
      />
    );

    const localUp= (
      <Input
        type = "text"
        label = "Local User Upload Bandwidth"
        value = { this.props.local_up_bandwidth }
      />
    );

    const localDown = (
      <Input
        type = "text"
        label = "Local User Download Bandwidth"
        value = { this.props.local_down_bandwidth }
      />
    );

    const anonUp= (
      <Input
        type = "text"
        label = "Anonymous User Upload Bandwidth"
        value = { this.props.anon_up_bandwidth }
      />
    );

    const anonDown = (
      <Input
        type = "text"
        label = "Anonymous User Download Bandwidth"
        value = { this.props.anon_down_bandwidth }
      />
    );

    const enableTLS = (
      <Input
        type = "checkbox"
        label = "Enable TLS"
        checked = { this.props.tls }
      />
    );

    const tlsPolicy = (
      <Input
        type = "select"
        label = "TLS Policy"
        value = { this.props.tls_policy }
      >
        { createDropdownOptions( TLS_POLICIES ) }
      </Input>
    );

    const tlsOptions = (
      <Input
        type = "select"
        label = "TLS Options"
        value = { this.props.tls_options }
        multiple
      >
        { createDropdownOptions( TLS_OPTIONS ) }
      </Input>
    );

    const certificate = (
      <Input
        type = "select"
        label = "TLS Certificate"
        value = { this.props.tls_ssl_certificate }
      >
        { /* Available TLS Certificates */ }
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
        <h4>FTP</h4>
        { toggleService }
        <form className = "settings-config-form">
          { port /*Basic Option*/ }
          { maxClients }
          { ipConnections }
          { loginAttempts }
          { timeout }
          { allowRoot /*Basic Option*/ }
          { localOnly /*Basic Option*/ }
          { onlyAnonymous /*Basic Option*/ }
          { /*anonPath*/ /*Basic Option*/ /*Actually not sure on this one*/ }
          { loginMessage /*Basic Option*/ }
          { /*defaultFilemask*/ }
          { /*defaultDirmask*/ }
          { fxp }
          { resumeTransfer }
          { chroot }
          { requireIdent }
          { reverseDNS }
          { masqueradeAddress }
          { minPassivePort }
          { maxPassivePort }
          { localUp }
          { localDown }
          { anonUp }
          { anonDown }
          { enableTLS }
          { tlsPolicy }
          { tlsOptions }
          { certificate }
          { formControlButtons }
        </form>
      </Panel>
    );
  }
};

FTP.propTypes = { tls_policy: React.PropTypes.oneOf( TLS_POLICIES )
                , filemask: React.PropTypes.string
                , anon_up_bandwidth: React.PropTypes.number
                , anonymous_path: React.PropTypes.string
                , ip_connections: React.PropTypes.number
                , dirmask: React.PropTypes.string
                , only_local: React.PropTypes.bool
                , port: React.PropTypes.number
                , chroot: React.PropTypes.bool
                , masquerade_address: React.PropTypes.string
                // Careful! We need to use real certs for this
                , tls_ssl_certificate: React.PropTypes.string
                , fxp: React.PropTypes.bool
                , local_up_bandwidth: React.PropTypes.number
                , login_attempt: React.PropTypes.number
                , only_anonymous: React.PropTypes.bool
                , local_down_bandwidth: React.PropTypes.number
                , passive_ports_min: React.PropTypes.number
                , resume: React.PropTypes.bool
                , passive_ports_max: React.PropTypes.number
                , max_clients: React.PropTypes.number
                , tls: React.PropTypes.bool
                , ident: React.PropTypes.bool
                , root_login: React.PropTypes.bool
                , display_login: React.PropTypes.string
                , reverse_dns: React.PropTypes.bool
                , anon_down_bandwidth: React.PropTypes.number
                , timeout: React.PropTypes.number
                , tls_options: React.PropTypes.arrayOf( React.PropTypes.oneOf( TLS_OPTIONS ) )
                };
