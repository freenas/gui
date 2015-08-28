// Network Config
// ==============
// Presents and allows editing of global network settings


"use strict";

import React from "react";
import TWBS from "react-bootstrap";
import _ from "lodash";

import NM from "../../../flux/middleware/NetworkConfigMiddleware";
import SM from "../../../flux/middleware/SystemMiddleware";

import networkCommon from "./networkCommon";

import Icon from "../../components/Icon";

const NetworkConfig = React.createClass(
  { mixins: [ networkCommon ]

  , propTypes: { networkConfig: React.PropTypes.object.isRequired
               , systemGeneralConfig: React.PropTypes.object.isRequired
               }

  , getDefaultProps () {
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

  , getInitialState () {
    return { updatedDNS: false
           , dnsServerInProgress: ""
           };
  }

    // The only concern here is reconciling changes to the DNS servers list
  , componentWillReceiveProps ( nextProps ) {
    var newNetworkConfig = {};
    // This is used just for submission to state later, not for other logic.
    var updatedDNS = false;

    // This only matters if there's a network config in state and it has dns servers in it
    if ( _.has( this, [ "state", "networkConfig", "dns"] ) ) {
      // This also only matters if there's a new DNS server in state.
      if ( this.state.networkConfig.dns.servers[ this.props.networkConfig.dns.servers.length ]
       !== undefined ) {
        // Check if there's a new DNS server incoming
        if ( nextProps.networkConfig.dns.servers.length
           > this.props.networkConfig.dns.servers.length
           ) {
          // Then, check if it's the same as the last one in state.
          if ( _.last( this.state.networkConfig.dns.servers )
           === _.last( nextProps.networkConfig.dns.servers )
             ) {
          // If it is, assume that means the last one in state was submitted
          // and delete the DNS servers in state.
          newNetworkConfig = _.cloneDeep( this.state.networkConfig );
          delete newNetworkConfig.dns;
          updatedDNS = true;
          } else {
            // Otherwise, just take the new server list and put the pending new
            // server on the end of the list.
            newNetworkConfig = this.combineDNSServerState( nextProps );
          }
        } else {
          // If there isn't an incoming new server or a server is being deleted,
          // append the last server in state to the incoming server list.
          newNetworkConfig = this.combineDNSServerState( nextProps );
        }
        this.setState( { networkConfig: newNetworkConfig
                       , updatedDNS: updatedDNS
                       } );
      }
    }
  }

  , componentDidUpdate( prevProps, prevState ) {
    if ( this.state.updatedDNS ) {
      React.findDOMNode( this.refs["dns-server-list"] ).scrollTop = 1000000;
    }
  }

  // Breaking this out to avoid duplicating it in componentWillReceiveProps
  , combineDNSServerState ( nextProps ) {
    // Take the new server list and put the pending new server on the end of the
    // list.
    var newNetworkConfig =
      { dns:
        { servers: _.cloneDeep( nextProps.networkConfig.dns.servers ) }
      };
    newNetworkConfig.dns.servers.push( this.state.networkConfig.dns.servers
                                     [ this.props.networkConfig.dns.servers.length ]
                                     );
    newNetworkConfig = _.defaultsDeep( newNetworkConfig
                                     , _.cloneDeep( this.state.networkConfig )
                                     );
    return newNetworkConfig;
  }

  , handleChange ( key, evt ) {

    var networkConfig = {};
    var systemGeneralConfig = {};

    switch ( key ) {
      case "hostname":
        if ( evt.target.value !== this.props.systemGeneralConfig[ "hostname" ] ) {
          systemGeneralConfig = { hostname: evt.target.value };
        }
        break;

      case "ipv4":
        networkConfig = { gateway: { ipv4: evt.target.value } };
        if ( _.has( this, [ "state", "networkConfig" ] ) ) {
          networkConfig = _.defaultsDeep( networkConfig, this.state.networkConfig );
        }
        break;

      case "ipv6":
        networkConfig = { gateway: { ipv6: evt.target.value } };
        if ( _.has( this, [ "state", "networkConfig" ] ) ) {
          networkConfig = _.defaultsDeep( networkConfig, this.state.networkConfig );
        }
        break;

      case "dns":
        this.setState( { dnsServerInProgress: evt.target.value } );
        break;
    }

    if ( !_.isEmpty( networkConfig ) ) {
      this.setState( { networkConfig: networkConfig } );
    }

    if ( !_.isEmpty( systemGeneralConfig ) ) {
      this.setState( { systemGeneralConfig: systemGeneralConfig } );
    }


  }

  , submit () {
    var newNetworkConfig = {};
    var newSystemGeneralConfig = {};

    if ( _.has( this, [ "state", "systemGeneralConfig", "hostname" ] )
      && this.isHostname( this.state.systemGeneralConfig.hostname ) ) {
      newSystemGeneralConfig[ "hostname" ] =
        this.state.systemGeneralConfig[ "hostname" ];
    }

    if ( _.has( this, [ "state", "networkConfig", "gateway", "ipv4" ] )
      && this.isIPv4( this.state.networkConfig.gateway.ipv4 ) ) {
      newNetworkConfig =
        { gateway: { ipv4: this.state.networkConfig[ "gateway" ][ "ipv4" ] } };
    }

    if ( _.has( this, [ "state", "networkConfig", "gateway", "ipv6" ] )
      && this.isIPv6( this.state.networkConfig.gateway.ipv6 ) ) {
      // Rely on previous check for ipv4 to determine whether to populate ipv4
      // from props
      if ( _.has( newNetworkConfig, [ "gateway", "ipv4" ] ) ) {
        newNetworkConfig[ "gateway" ][ "ipv6" ] =
          this.state.networkConfig[ "gateway" ][ "ipv6" ];
      } else {
        newNetworkConfig =
          { gateway: { ipv6: this.state.networkConfig[ "gateway" ][ "ipv6" ] } };
      }
    // If ipv4 was updated but ipv6 was not, add ipv6 information from props
    } else if ( _.has( newNetworkConfig, [ "gateway", "ipv4" ] ) ) {
      newNetworkConfig[ "gateway" ][ "ipv6" ] =
        this.props.networkConfig[ "gateway" ][ "ipv6" ];
    }

    if ( _.has( this, [ "state", "networkConfig", "dns" ] ) ) {
      if ( !_.isEmpty( newNetworkConfig ) ) {
        newNetworkConfig =
          { dns: { servers: this.state.networkConfig[ "dns" ][ "servers" ] } };
      } else {
        _.assign( newNetworkConfig
                , { dns: { servers: this.state.networkConfig[ "dns" ][ "servers" ] } } );
      }
    }

    if ( !_.isEmpty( newNetworkConfig ) ) {
      NM.updateNetworkConfig( newNetworkConfig );
    }

    if ( !_.isEmpty( newSystemGeneralConfig ) ) {
      SM.updateSystemGeneralConfig( newSystemGeneralConfig );
    }
  }

  , advanceCursor ( target, evt ) {
    var newConfig = {};

    if ( evt.key === "Enter" ) {
      switch ( target ) {
        case "hostname":
          this.refs.ipv4.getInputDOMNode().focus();
          break;

        case "ipv4":
          if ( this.isIPv4( evt.target.value ) ) {
            this.refs.ipv6.getInputDOMNode().focus();
          }
          break;

        case "ipv6":
          if ( this.isIPv6( evt.target.value ) ) {
            this.refs.dns.getInputDOMNode().focus();
          }
          break;
      }
    }
  }

  , addDNSServer ( evt ) {
    var newNetworkConfig = {};
    var newDNSServers = [];
    if ( evt.key === "Enter" ) {
      if ( this.isIPv4( this.state.dnsServerInProgress ) ) {
        if ( _.has( this, [ "state", "networkConfig", "dns", "servers" ] ) ) {
          newDNSServers = this.state.networkConfig[ "dns" ][ "servers" ].slice();
          newDNSServers.push( this.state.dnsServerInProgress );
          newNetworkConfig[ "dns" ][ "servers" ] = newDNSServers;
          newNetworkConfig = _.merge( _.cloneDeep( this.state.networkConfig )
                                    , newNetworkConfig
                                    , function mergeDNSHard ( newValue ) {
                                      return newValue;
                                    }
                                    );
        } else {
          newDNSServers = this.props.networkConfig[ "dns" ][ "servers" ].slice();
          newDNSServers.push( this.state.dnsServerInProgress );
          _.assign( newNetworkConfig, { dns: { servers: newDNSServers } } );
          if ( _.has( this, [ "state", "networkConfig" ] ) ) {
            newNetworkConfig = _.merge( _.cloneDeep( this.state.networkConfig )
                          , newNetworkConfig
                          , function mergeDNSHard ( newValue ) {
                            return newValue;
                          }
                          );
          }
        }
      }
    }

    if ( !_.isEmpty( newNetworkConfig ) ) {
      this.setState( { dnsServerInProgress: ""
                     , networkConfig: newNetworkConfig } );
    }
  }

  /**
   * Delete a DNS server.
   * @param  {int} index The index of server to delete in the dns.servers array.
   */
  , deleteDnsServer ( index ) {
    var networkConfig = {};
    if ( _.has( this, [ "state", "networkConfig", "dns", "servers" ] ) ) {
      networkConfig = { dns: { servers: this.state.networkConfig.dns.servers.slice() } };
      _.pullAt( networkConfig.dns.servers, index );
      networkConfig = _.defaultsDeep( networkConfig, this.state.networkConfig );
    } else {
      networkConfig = { dns: { servers: this.props.networkConfig.dns.servers.slice() } };
      if ( _.has( this, [ "state", "networkConfig" ] ) ) {
        networkConfig = _.defaultsDeep( networkConfig, this.state.networkConfig );
      }
      _.pullAt( networkConfig.dns.servers, index );
    }
    this.setState( { networkConfig: networkConfig } );
  }

  , validate ( key, value ) {

    var responseStyle = null;
    switch ( key ) {
      case "hostname":
        if ( !this.isHostname( value )
          && _.has( this, [ "state", "systemGeneralConfig", "hostname" ] ) ) {
          responseStyle = "error";
        }
        break;

      case "ipv4":
        if ( !this.isIPv4( value )
          && _.has( this, [ "state", "networkConfig", "gateway", "ipv4" ] ) ) {
          responseStyle = "error";
        }
        break;

      case "ipv6":
        if ( !this.isIPv6( value )
          && _.has( this, [ "state", "networkConfig", "gateway", "ipv6" ] ) ) {
          responseStyle = "error";
        }
        break;

      case "dns":
        if ( !this.isIPv4( value )
          // && !this.isIPv6( value )
          && ( _.has( this, [ "state", "networkConfig", "dns", "servers" ] ) )
           ) {
          responseStyle = "error";
        }
        break;
    }

    return responseStyle;
  }

  , resetFocus ( key, evt ) {
    switch ( key ) {
      case "hostname":
        if ( !this.isHostname( evt.target.value ) ) {
          evt.target.focus();
        }
        break;

      case "ipv4":
        if ( !this.isIPv4( evt.target.value ) ) {
          evt.target.focus();
        }
        break;

      case "ipv6":
        if ( !this.isIPv6( evt.target.value ) ) {
          evt.target.focus();
        }
        break;

      /*case "dns":
        if ( !this.isIPv4( evt.target.value )
          // && !this.isIPv6( evt.target.value )
           ) {
          evt.target.focus();
        }
        break;*/
    }
  }

  , resetAll () {
    this.setState( { networkConfig: {}
                   , systemGeneralConfig: {}
                   , updatedDNS: false
                   }
                 );
  }

  , render () {
    var hostname = null;
    var hostnameValue = this.props.systemGeneralConfig[ "hostname" ];
    var ipv4Gateway = null;
    var ipv4GatewayValue = this.props.networkConfig[ "gateway" ][ "ipv4" ];
    var ipv6Gateway = null;
    var ipv6GatewayValue = this.props.networkConfig[ "gateway" ][ "ipv6" ];
    var dnsServers = _.has( this, [ "state", "networkConfig", "dns", "servers" ] )
                   ? this.state.networkConfig[ "dns" ][ "servers" ].slice()
                   : this.props.networkConfig[ "dns" ][ "servers" ].slice();
    var dnsNodes = null;
    var newDNSInput = null;
    var formControlButtons = null;

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
            ref = "hostname"
            value = { hostnameValue }
            bsStyle = { this.validate( "hostname", hostnameValue ) }
            onBlur = { this.resetFocus.bind( null, "hostname" ) }
            onKeyDown = { this.advanceCursor.bind( this, "hostname" ) }
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
            ref = "ipv4"
            value = { ipv4GatewayValue }
            bsStyle = { this.validate( "ipv4", ipv4GatewayValue ) }
            onBlur = { this.resetFocus.bind( null, "ipv4" ) }
            onKeyDown = { this.advanceCursor.bind( this, "ipv4" ) }
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
            ref = "ipv6"
            value = { ipv6GatewayValue }
            bsStyle = { this.validate( "ipv6", ipv6GatewayValue ) }
            onBlur = { this.resetFocus.bind( null, "ipv6" ) }
            onKeyDown = { this.advanceCursor.bind( this, "ipv6" ) }
            onChange = { this.handleChange.bind( this, "ipv6" ) } />
        </TWBS.Col>
      </div>;


    dnsNodes =
      <div className = "dns-server-list"
           ref = "dns-server-list">
        { _.map(
          dnsServers
          , function mapDNSServers ( server, index ) {
            return (
              <div className="dns-server"
                   key = { index }>
                <span>{ server }</span>
                <TWBS.Button
                  className = "pull-right"
                  onClick = { this.deleteDnsServer.bind( null, index ) }
                  bsStyle = "danger"
                  bsSize  = "xsmall"
                  title   = "Delete Server">
                  <Icon glyph="times" />
                </TWBS.Button>
              </div>
            );
          }
          , this
          )
        }
      </div>;

    newDNSInput =
      <TWBS.Input
        type = "text"
        ref = "dns"
        // hasFeedback
        value = { this.state.dnsServerInProgress }
        // bsStyle = { this.validate( "dns", newDNSServer ) }
        // onBlur = { this.resetFocus.bind( null, "dns" ) }
        onChange = { this.handleChange.bind( this, "dns" ) }
        onKeyDown = { this.addDNSServer }
        placeholder = "Enter new DNS server" />;

    formControlButtons =
      <TWBS.ButtonToolbar className = "pull-right">
        <TWBS.Button
          bsStyle = "default"
          onClick = { this.resetAll }>
          { "Reset" }
        </TWBS.Button>
        <TWBS.Button
          bsStyle = "primary"
          onClick = { this.submit } >
          { "Apply" }
        </TWBS.Button>
      </TWBS.ButtonToolbar>;

    return (
      <form className = "network-overview">
        <h3 className = "text-center">Network Configuration</h3>
        <TWBS.Grid fluid>
          <TWBS.Row>
            <TWBS.Col md = { 12 }
                      lg = { 6 } >
              { hostname }
              { ipv4Gateway }
              { ipv6Gateway }
            </TWBS.Col>
            <TWBS.Col md = { 8 }
                      lg = { 6 } >
              <TWBS.Col xs = { 12 } >
                <h5>DNS Servers</h5>
              </TWBS.Col>
              <TWBS.Col xs = { 12 }
                        className = "dns-section"
                        ref = "dns-section">
                { dnsNodes }
                <TWBS.Row>
                  <TWBS.Col sm = { 9 } >
                    { newDNSInput }
                  </TWBS.Col >
                </TWBS.Row>
              </TWBS.Col>
            </TWBS.Col>
          </TWBS.Row>
          <TWBS.Row>
            <TWBS.Col xs = { 12 }>
              { formControlButtons }
            </TWBS.Col>
          </TWBS.Row>
        </TWBS.Grid>
      </form>
    );
  }
});

export default NetworkConfig;
