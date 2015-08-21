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

  , getInitialState () {
    return { newDnsServer: "" };
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

    var networkConfig;
    var systemGeneralConfig = {};

    switch ( key ) {
      case "hostname":
        if ( _.has( this, [ "state", "systemGeneralConfig", "hostname" ] ) ) {
          systemGeneralConfig = this.state.systemGeneralConfig;
        }
        systemGeneralConfig[ "hostname" ] = evt.target.value;
        this.setState({ systemGeneralConfig: systemGeneralConfig });
        break;

      case "ipv4":
        networkConfig = this.props.networkConfig
                     || this.state.networkConfig;
        networkConfig.gateway.ipv4 = evt.target.value;
        this.setState({ networkConfig: networkConfig });
        break;

      case "ipv6":
        networkConfig = this.props.networkConfig
                     || this.state.networkConfig;
        networkConfig.gateway.ipv6 = evt.target.value;
        this.setState({ networkConfig: networkConfig });
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
      }
    }
  }

/*  , saveGeneralConfig: function ( evt ) {
    evt.stopPropagation();

    // No need to call the API if there are no changes.
    if ( !_.isEqual( this.state.systemGeneralConfig
                    , this.state.oldSystemGeneralConfig ) ) {
      SM.updateSystemGeneralConfig( this.state.systemGeneralConfig );

      this.setState({
        oldSystemGeneralConfig: _.cloneDeep( this.state.systemGeneralConfig )
      });
    }

    if ( !_.isEqual( this.state.networkConfig
                    , this.state.oldNetworkConfig ) ) {
      NM.updateNetworkConfig( this.state.networkConfig );

      this.setState({
        oldNetworkConfig: _.cloneDeep( this.state.networkConfig )
      });
    }
  }*/

  /**
   * Add a new DNS server.
   */
  , addNewDnsServer: function () {
    if ( this.state.newDnsServer === "" ) {
      // No need to add an empty server.
      return;
    }

    var networkConfig = this.state.networkConfig;
    if ( _.includes( networkConfig.dns.servers, this.state.newDnsServer ) ) {
      // No need to add a duplicate entry.
      return;
    }

    // Append a new DNS server to the list.
    networkConfig.dns.servers.push( this.state.newDnsServer );

    // Reset the input value.
    this.setState({
      networkConfig: networkConfig
      , newDnsServer: ""
    });
  }

  /**
   * Delete a DNS server.
   * @param  {int} index The index of server to delete in the dns.servers array.
   */
  , deleteDnsServer: function ( index ) {
    var networkConfig = this.state.networkConfig;
    networkConfig.dns.servers.splice( index, 1 );
    this.setState({
      networkConfig: networkConfig
    });
  }

  , validate ( key, value ) {

    var responseStyle = "";
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
        <TWBS.Col xs = { 3 }>{ "Hostname" }</TWBS.Col>
        <TWBS.Col xs = { 9 }>
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
        <TWBS.Col xs = { 3 }>{ "IPv4 Default Gateway" }</TWBS.Col>
        <TWBS.Col xs = { 9 }>
          <TWBS.Input
            type = "text"
            value = { ipv4GatewayValue }
            bsStyle = { this.validate( "ipv4", ipv4GatewayValue ) }
            onKeyDown = { this.submitChange.bind( this, "ipv4" ) }
            onChange = { this.handleChange.bind( this, "ipv4" ) } />
        </TWBS.Col>
      </div>;

    if ( _.has( this.state, [ "networkConfig", "gateway", "ipv6" ] ) ) {
      ipv6GatewayValue = this.state.networkConfig[ "gateway" ][ "ipv6" ];
    }
    ipv6Gateway =
      <div>
        <TWBS.Col xs = { 3 }>{ "IPv6 Default Gateway" }</TWBS.Col>
        <TWBS.Col xs = { 9 }>
          <TWBS.Input
            type = "text"
            value = { ipv6GatewayValue }
            bsStyle = { this.validate( "ipv6", ipv6GatewayValue ) }
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
            <TWBS.Col sm = { 4 }>
              { hostname }
              { ipv4Gateway }
              { ipv6Gateway }
            </TWBS.Col>
            <TWBS.Col sm = { 4 }>
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
