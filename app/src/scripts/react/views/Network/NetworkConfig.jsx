// Network Config
// ==============
// Presents and allows editing of global network settings


"use strict";

import React from "react";
import TWBS from "react-bootstrap";
import _ from "lodash";

import NM from "../../../flux/middleware/NetworkConfigMiddleware";
import SM from "../../../flux/middleware/SystemMiddleware";

import Icon from "../../components/Icon";

const NetworkConfig = React.createClass(
  { propTypes: { networkConfig: React.PropTypes.object.isRequired
               , systemGeneralConfig: React.PropTypes.object.isRequired
               }

  , getDefaultProps: function () {
    return { networkConfig:
             { dhcp:
               { assign_gateway: false
               , assign_dns: false
               }
             , http_proxy: null
             , autoconfigure: false
             , dns:
               { search: []
               , servers: []
               }
             , gateway:
               { ipv4: ""
               , ipv6: ""
               }
             }
           , systemGeneralConfig:
             { timezone: ""
             , hostname: ""
             , language: ""
             , console_keymap: ""
             }
           };
  }

  , handleChange: function ( key, evt ) {

    var networkConfig = {};
    var systemGeneralConfig = {};

    switch ( key ) {
      case "hostname":
        systemGeneralConfig = { hostname: evt.target.value };
        if ( _.has( this, [ "state", "systemGeneralConfig" ] ) ) {
          this.setState( { systemGeneralConfig: _.defaultsDeep( systemGeneralConfig, this.state.systemGeneralConfig ) } );
        } else {
          this.setState( { systemGeneralConfig: systemGeneralConfig } );
        }
        break;

      case "ipv4":
        networkConfig = { gateway: { ipv4: evt.target.value } };
        if ( _.has( this, [ "state", "networkConfig" ] ) ) {
          this.setState( { networkConfig: _.defaultsDeep( networkConfig, this.state.networkConfig ) } );
        } else {
          this.setState( { networkConfig: networkConfig } );
        }
        break;

      case "ipv6":
        networkConfig = { gateway: { ipv6: evt.target.value } };
        if ( _.has( this, [ "state", "networkConfig" ] ) ) {
          this.setState( { networkConfig: _.defaultsDeep( networkConfig, this.state.networkConfig ) } );
        } else {
          this.setState( { networkConfig: networkConfig } );
        }
        break;

      // TODO: Take a hard look at this.
      case "newDnsServer":
        this.setState({ newDnsServer: evt.target.value });
        break;
    }
  }

  , submitChange ( target, evt ) {
    var newConfig = {};

    if ( evt.key === "Enter" ) {
      switch ( target ) {
        case "hostname":
          newConfig[ "hostname" ] = this.state.systemGeneralConfig[ "hostname" ];
          SM.updateSystemGeneralConfig( newConfig );
          break;

        case "ipv4":
          newConfig = { gateway: { ipv4: this.state.networkConfig[ "gateway" ][ "ipv4" ] } }
          NM.updateNetworkConfig( newConfig );
          break;

        case "ipv6":
          newConfig = { gateway: { ipv6: this.state.networkConfig[ "gateway" ][ "ipv6" ] } }
          NM.updateNetworkConfig( newConfig );
          break;
      }

    }
  }

  /**
   * Delete a DNS server.
   * @param  {int} index The index of server to delete in the dns.servers array.
   */
  , deleteDnsServer: function ( index ) {
    var networkConfig = {};

    if ( _.has( this, [ "state", "networkConfig", "dns", "servers" ] ) ) {
      networkConfig = this.state.networkConfig;
    } else {
      networkConfig = { dns: { servers: this.props.networkConfig.dns.servers } };
    }
    networkConfig.dns.servers.splice( index, 1 );
    this.setState( { networkConfig: networkConfig } );
  }

  , validate ( key, value ) {

    var responseStyle = null;
    switch ( key ) {
      case "ipv4":
        if ( !isIPv4( value ) ) {
          responseStyle = "error";
        }
        break;

      case "ipv6":
        if ( !isIPv6( value ) ) {
          responseStyle = "error";
        }
        break;

      default:
        break;
    }

    return responseStyle;
  }

  , resetFocus ( key, evt ) {
    switch ( key ) {
      case "ipv4":
        if ( !isIPv4( evt.target.value ) ) {
          evt.target.focus();
        }
        break;
      case "ipv6":
        if ( !isIPv6( evt.target.value ) ) {
          evt.target.focus();
        }
        break;
    }
  }

  , render: function () {
    var hostname = null;
    var hostnameValue = this.props.systemGeneralConfig[ "hostname" ];
    var ipv4Gateway = null;
    var ipv4GatewayValue = this.props.networkConfig[ "gateway" ][ "ipv4" ];
    var ipv6Gateway = null;
    var ipv6GatewayValue = this.props.networkConfig[ "gateway" ][ "ipv6" ];

    if ( _.has( this.state, [ "systemGeneralConfig", "hostname" ] ) ) {
      hostnameValue = this.state.systemGeneralConfig[ "hostname" ];
    }
    hostname =
      <div>
        <TWBS.Col md = { 4 }
                  sm = { 5 }>
          { "Hostname" }
        </TWBS.Col>
        <TWBS.Col md = { 8 }
                  sm = { 7 }>
          <TWBS.Input
            type = "text"
            value = { hostnameValue }
            onKeyDown = { this.submitChange.bind( this, "hostname" ) }
            onChange = { this.handleChange.bind( this, "hostname" ) } />
        </TWBS.Col>
      </div>;

    if ( _.has( this.state, [ "networkConfig", "gateway", "ipv4" ] ) ) {
      ipv4GatewayValue = this.state.networkConfig[ "gateway" ][ "ipv4" ];
    }
    ipv4Gateway =
      <div>
        <TWBS.Col md = { 4 }
                  sm = { 5 }>
          { "IPv4 Default Gateway" }
        </TWBS.Col>
        <TWBS.Col md = { 8 }
                  sm = { 7 }>
          <TWBS.Input
            type = "text"
            value = { ipv4GatewayValue }
            bsStyle = { this.validate( "ipv4", ipv4GatewayValue ) }
            onBlur = { this.resetFocus.bind( null, "ipv4") }
            onKeyDown = { this.submitChange.bind( this, "ipv4" ) }
            onChange = { this.handleChange.bind( this, "ipv4" ) } />
        </TWBS.Col>
      </div>;

    if ( _.has( this.state, [ "networkConfig", "gateway", "ipv6" ] ) ) {
      ipv6GatewayValue = this.state.networkConfig[ "gateway" ][ "ipv6" ];
    }
    ipv6Gateway =
      <div>
        <TWBS.Col md = { 4 }
                  sm = { 5 }>
          { "IPv6 Default Gateway" }
        </TWBS.Col>
        <TWBS.Col md = { 8 }
                  sm = { 7 }>
          <TWBS.Input
            type = "text"
            value = { ipv6GatewayValue }
            bsStyle = { this.validate( "ipv6", ipv6GatewayValue ) }
            onBlur = { this.resetFocus.bind( null, "ipv6") }
            onKeyDown = { this.submitChange.bind( this, "ipv6" ) }
            onChange = { this.handleChange.bind( this, "ipv6" ) } />
        </TWBS.Col>
      </div>;

    // Compile the DNS server list.
    var dnsNodes =
      <li>
        <div className="dns-server">
          <em>No DNS servers configured</em>
        </div>
      </li>;

    if ( _.has( this, [ "props", "networkConfig", "dns", "servers", "length"] ) ) {
      dnsNodes = _.map(
        this.props.networkConfig.dns.servers
        , function ( server, index ) {
          return (
            <li key={ index }>
              <div className="dns-server">
                {server}
              </div>
              <TWBS.Button
                onClick = { this.deleteDnsServer.bind( null, index ) }
                bsStyle = "danger"
                bsSize  = "small"
                title   = "Delete Server">
                <Icon glyph="times" />
              </TWBS.Button>
            </li>
          );
        }
        , this
      );
    }

    dnsNodes =
      <ul className="dns-server-list">
        { dnsNodes }
      </ul>;

    return (
      <div className = "network-overview">
        <h3 className = "text-center">Network Configuration</h3>
        <TWBS.Grid fluid>
          <TWBS.Row>
            <TWBS.Col md = { 12 }
                      lg = { 6 } >
              { hostname }
              { ipv4Gateway }
              { ipv6Gateway }
            </TWBS.Col>
            <TWBS.Col md = { 6 }
                      lg = { 3 } >
              <TWBS.Col xs = { 12 } >
                <h5>DNS Servers</h5>
              </TWBS.Col>
              <TWBS.Col xs = { 12 } >
                { dnsNodes }
                <TWBS.Row>
                  <TWBS.Col sm = { 9 } >
                    <TWBS.Input
                      type        = "text"
                      value       = {this.state.newDnsServer}
                      onChange    =
                        {this.handleChange.bind( this, "newDnsServer" )}
                      placeholder = "Enter the new DNS server" />
                  </TWBS.Col >
                </TWBS.Row>
              </TWBS.Col>
            </TWBS.Col>
          </TWBS.Row>
        </TWBS.Grid>
      </div>
    );
  }
});

function isIPv4 ( input ) {
  return /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(input);
};

function isIPv6 ( input ) {
  return /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$|^(([a-zA-Z]|[a-zA-Z][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z]|[A-Za-z][A-Za-z0-9\-]*[A-Za-z0-9])$|^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/.test(input);
};

export default NetworkConfig;
