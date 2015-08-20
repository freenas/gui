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

    var networkConfig;
    var systemGeneralConfig;

    switch ( key ) {
      case "hostname":
        systemGeneralConfig = this.props.systemGeneralConfig
                           || this.state.systemGeneralConfig;
        systemGeneralConfig.hostname = evt.target.value;
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

  , saveGeneralConfig: function ( evt ) {
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
  }

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

  , render: function () {
    var hostname = "";
    var ipv4Gateway = "";
    var ipv6Gateway = "";

    if ( _.has( this, [ "state", "networkConfig", "dns", "servers", "length"] ) ) {
      hostname = this.state.systemGeneralConfig
               ? this.state.systemGeneralConfig.hostname
               : "";

      ipv4Gateway = this.state.networkConfig
                  ? this.state.networkConfig.gateway.ipv4
                  : "";

      ipv6Gateway = this.state.networkConfig
                  ? this.state.networkConfig.gateway.ipv6
                  : "";
    }

    // Compile the DNS server list.
    var dnsNodes =
      <li>
        <div className="dns-server">
          <em>No DNS servers configured</em>
        </div>
      </li>;


    if ( _.has( this, [ "state", "networkConfig", "dns", "servers", "length"] ) ) {
      dnsNodes = _.map(
        this.state.networkConfig.dns.servers
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
      );
    }

    dnsNodes =
      <ul className="dns-server-list">
        { dnsNodes }
      </ul>;

    return (
      <div className = "network-overview">
        <div className = "text-center" >
          <h3>Network Configuration</h3>
        </div>
        <TWBS.Grid fluid>
          <TWBS.Row>
            <TWBS.Col sm = { 6 }>
              <div className="form-group">
                <TWBS.Col xs = { 3 } >
                  <span>Hostname</span>
                </TWBS.Col>
                <TWBS.Col xs = { 9 } >
                  <TWBS.Input
                    type        = "text"
                    value       = { hostname }
                    onChange    =
                      {this.handleChange.bind( this, "hostname" )}
                    placeholder = { this.props[ "systemGeneralConfig" ][ "hostname" ] } />
                </TWBS.Col>
              </div>
              <div className="form-group">
                <TWBS.Col xs = { 3 } >
                  <span>IPv4 Default Gateway</span>
                </TWBS.Col>
                <TWBS.Col xs = { 9 } >
                  <TWBS.Input
                    type        = "text"
                    value       = { ipv4Gateway }
                    onChange    =
                      {this.handleChange.bind( this, "ipv4" )}
                    placeholder = { this.props[ "networkConfig" ][ "gateway" ][ "ipv4" ] } />
                </TWBS.Col>
              </div>
              <div className="form-group">
                <TWBS.Col xs = { 3 } >
                  <span>IPv6 Default Gateway</span>
                </TWBS.Col>
                <TWBS.Col xs = { 9 } >
                  <TWBS.Input
                    type        = "text"
                    value       = { ipv6Gateway }
                    onChange    =
                      {this.handleChange.bind( this, "ipv6" )}
                    placeholder = { this.props[ "networkConfig" ][ "gateway" ][ "ipv6" ] } />
                </TWBS.Col>
              </div>
            </TWBS.Col>
            <TWBS.Col sm = { 6 }>
              <div className="form-group">
                <TWBS.Col xs = { 3 } >
                  <span>DNS Server</span>
                </TWBS.Col>
                <TWBS.Col xs = { 9 } >
                  { dnsNodes }
                  { /*<TWBS.Row>
                    <TWBS.Col sm = { 9 } >
                      <TWBS.Input
                        type        = "text"
                        value       = {this.state.newDnsServer}
                        onChange    =
                          {this.handleChange.bind( this, "newDnsServer" )}
                        placeholder = "Enter the new DNS server" />
                    </TWBS.Col >
                    <TWBS.Col sm = {3}
                              className="text-right">
                      <TWBS.Button
                        onClick = { this.addNewDnsServer }
                        bsStyle = "primary"
                        bsSize  = "small"
                        title   = "Add New DNS Server">
                        <Icon glyph="plus" />
                      </TWBS.Button>
                    </TWBS.Col>
                  </TWBS.Row> */}
                </TWBS.Col>
              </div>
            </TWBS.Col>
          </TWBS.Row>
        </TWBS.Grid>
      </div>
    );
  }
});

export default NetworkConfig;
