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
    return { updatedDNS: false };
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

      case "dns":

        if ( _.has( this, [ "state", "networkConfig", "dns", "servers" ] ) ) {
          if ( evt.target.value === "" ) {
            // If the new server is empty, reset the servers in state and bail out
            networkConfig = this.state.networkConfig;
            delete networkConfig.dns;
          } else {
            // If there are already dns servers in state, copy those for the new state
            networkConfig = { dns: { servers: this.state.networkConfig.dns.servers.slice() } };
            if ( networkConfig.dns.servers[ this.props.networkConfig.dns.servers.length ] !== undefined ) {
              // If the servers in state include one past the end of the array of existing servers,
              // that's the WIP server. Update that one.
              networkConfig.dns.servers[ this.props.networkConfig.dns.servers.length ] = evt.target.value;
            } else {
              // If there are servers in state but none past the end of the established ones,
              // add the new server there.
              // Note: This should not happen, because servers in state should
              // be cleared if there are none in progress.
              networkConfig.dns.servers.push( evt.target.value );
            }
            // Once the new servers array is set, merge them with the existing state for submission.
            networkConfig = _.defaultsDeep( networkConfig, this.state.networkConfig );
          }
        } else {
          // If there are no dns servers in state, copy the ones from props there
          // and add the new one to the end.
          networkConfig = { dns: { servers: this.props.networkConfig.dns.servers.slice() } };
          networkConfig.dns.servers.push( evt.target.value );
        }
        this.setState( { networkConfig: networkConfig } );
        break;
    }
  }

  , submitChange ( target, evt ) {
    var newConfig = {};

    if ( evt.key === "Enter" ) {
      switch ( target ) {
        case "hostname":
          if ( _.has( this, [ "state", "systemGeneralConfig", "hostname" ] )
            && this.isHostname( this.state.systemGeneralConfig.hostname ) ) {
            newConfig[ "hostname" ] = this.state.systemGeneralConfig[ "hostname" ];
            SM.updateSystemGeneralConfig( newConfig );
          }
          this.refs.ipv4.getInputDOMNode().focus();
          break;

        case "ipv4":
          if ( _.has( this, [ "state", "networkConfig", "gateway", "ipv4" ] )
            && this.isIPv4( this.state.networkConfig.gateway.ipv4 ) ) {
            newConfig = { gateway: { ipv4: this.state.networkConfig[ "gateway" ][ "ipv4" ]
                                   , ipv6: this.props.networkConfig[ "gateway" ][ "ipv6" ]
                                   }
                        }
            NM.updateNetworkConfig( newConfig );
          }
          this.refs.ipv6.getInputDOMNode().focus();
          break;

        case "ipv6":
          if ( _.has( this, [ "state", "networkConfig", "gateway", "ipv6" ] )
            && this.isIPv6( this.state.networkConfig.gateway.ipv6 ) ) {
            newConfig = { gateway: { ipv4: this.props.networkConfig[ "gateway" ][ "ipv4" ]
                                   , ipv6: this.state.networkConfig[ "gateway" ][ "ipv6" ]
                                   }
                        }
            NM.updateNetworkConfig( newConfig );
          }
          this.refs.dns.getInputDOMNode().focus();
          break;

        case "dns":
          if ( _.has( this, [ "state", "networkConfig", "dns" ] )
            && this.isIPv4( _.last ( this.state.networkConfig.dns.servers ) ) ) {
            newConfig = { dns: { servers: this.state.networkConfig[ "dns" ][ "servers" ] } };
            NM.updateNetworkConfig( newConfig );
          }
          break;
      }
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
      // Don't accidentally send a work-in-progress server when deleting an old one
      if ( this.state.networkConfig.dns.servers[ this.props.networkConfig.dns.servers.length ]
       !== undefined ) {
        networkConfig.dns.servers.pop();
      }
    } else {
      networkConfig = { dns: { servers: this.props.networkConfig.dns.servers.slice() } };
    }
    _.pullAt( networkConfig.dns.servers, index );
    NM.updateNetworkConfig( networkConfig );
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

  , render () {
    var hostname = null;
    var hostnameValue = this.props.systemGeneralConfig[ "hostname" ];
    var ipv4Gateway = null;
    var ipv4GatewayValue = this.props.networkConfig[ "gateway" ][ "ipv4" ];
    var ipv6Gateway = null;
    var ipv6GatewayValue = this.props.networkConfig[ "gateway" ][ "ipv6" ];
    var newDNSServer = null;
    var dnsNodes = null;

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
            ref = "ipv4"
            value = { ipv4GatewayValue }
            bsStyle = { this.validate( "ipv4", ipv4GatewayValue ) }
            onBlur = { this.resetFocus.bind( null, "ipv4" ) }
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
            ref = "ipv6"
            value = { ipv6GatewayValue }
            bsStyle = { this.validate( "ipv6", ipv6GatewayValue ) }
            onBlur = { this.resetFocus.bind( null, "ipv6" ) }
            onKeyDown = { this.submitChange.bind( this, "ipv6" ) }
            onChange = { this.handleChange.bind( this, "ipv6" ) } />
        </TWBS.Col>
      </div>;


    if ( _.has( this, [ "props", "networkConfig", "dns", "servers", "length"] ) ) {
      dnsNodes =
        <div className = "dns-server-list"
             ref = "dns-server-list">
          { _.map(
            this.props.networkConfig.dns.servers
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
    }

    if ( _.has( this, [ "state", "networkConfig", "dns", "servers"] ) ) {
      // The new DNS server is the next server in state after all the ones in
      // props, or null if there isn't one.
      newDNSServer = this.state.networkConfig.dns.servers
                     [ this.props.networkConfig.dns.servers.length ]
                  || null;
    }

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
                    <TWBS.Input
                      type = "text"
                      ref = "dns"
                      value = { newDNSServer }
                      bsStyle = { this.validate( "dns", newDNSServer ) }
                      // onBlur = { this.resetFocus.bind( null, "dns" ) }
                      onChange = { this.handleChange.bind( this, "dns" ) }
                      onKeyDown = { this.submitChange.bind( this, "dns" ) }
                      placeholder = "Enter new DNS server" />
                  </TWBS.Col >
                </TWBS.Row>
              </TWBS.Col>
            </TWBS.Col>
          </TWBS.Row>
        </TWBS.Grid>
      </form>
    );
  }
});

export default NetworkConfig;
