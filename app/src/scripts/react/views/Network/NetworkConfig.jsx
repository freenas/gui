// Network Config
// ==============
// Presents and allows editing of global network settings


"use strict";

import React from "react";
import { Col, Input, Button, ButtonToolbar, Grid, Row } from "react-bootstrap";
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
    return { dnsServerInProgress: "" };
  }

  // Totally wipes out config changes in state.
  // TODO: Use this function to create the conflict state.
  , componentWillReceiveProps ( nextProps ) {
    this.replaceState( { dnsServerInProgress: this.state.dnsServerInProgress } );
  }

  , handleChange ( key, evt ) {

    var networkConfig = {};
    var systemGeneralConfig = {};
    let removeSystemGeneralConfig = false;

    switch ( key ) {
      case "hostname":
        if ( evt.target.value !== this.props.systemGeneralConfig.hostname ) {
          systemGeneralConfig = { hostname: evt.target.value };
        } else {
          // This allows the hostname to return to its neutral value.
          removeSystemGeneralConfig = true;
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
    } else if ( removeSystemGeneralConfig ) {
      let newState = _.cloneDeep( this.state );
      delete newState.systemGeneralConfig;
      this.replaceState( newState );
    }
  }

  , submit () {
    var newNetworkConfig = {};
    var newSystemGeneralConfig = {};

    if ( _.has( this, [ "state", "systemGeneralConfig", "hostname" ] )
      && this.isHostname( this.state.systemGeneralConfig.hostname ) ) {
      newSystemGeneralConfig.hostname =
        this.state.systemGeneralConfig.hostname;
    }

    if ( _.has( this, [ "state", "networkConfig", "gateway", "ipv4" ] )
      && this.isIPv4( this.state.networkConfig.gateway.ipv4 ) ) {
      newNetworkConfig =
        { gateway: { ipv4: this.state.networkConfig.gateway.ipv4 } };
    }

    if ( _.has( this, [ "state", "networkConfig", "gateway", "ipv6" ] )
      && this.isIPv6( this.state.networkConfig.gateway.ipv6 ) ) {
      // Rely on previous check for ipv4 to determine whether to populate ipv4
      // from props
      if ( _.has( newNetworkConfig, [ "gateway", "ipv4" ] ) ) {
        newNetworkConfig.gateway.ipv6 =
          this.state.networkConfig.gateway.ipv6;
      } else {
        newNetworkConfig =
          { gateway: { ipv6: this.state.networkConfig.gateway.ipv6 } };
      }
    // If ipv4 was updated but ipv6 was not, add ipv6 information from props
    } else if ( _.has( newNetworkConfig, [ "gateway", "ipv4" ] ) ) {
      newNetworkConfig.gateway.ipv6 =
        this.props.networkConfig.gateway.ipv6;
    }

    if ( _.has( this, [ "state", "networkConfig", "dns" ] ) ) {
      if ( !_.isEmpty( newNetworkConfig ) ) {
        newNetworkConfig =
          { dns: { servers: this.state.networkConfig.dns.servers } };
      } else {
        _.assign( newNetworkConfig
                , { dns: { servers: this.state.networkConfig.dns.servers } } );
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
          newDNSServers = this.state.networkConfig.dns.servers.slice();
          newDNSServers.push( this.state.dnsServerInProgress );
          _.assign( newNetworkConfig, { dns: { servers: newDNSServers } } );
          newNetworkConfig = _.merge( _.cloneDeep( this.state.networkConfig )
                                    , newNetworkConfig
                                    );
        } else {
          newDNSServers = this.props.networkConfig.dns.servers.slice();
          newDNSServers.push( this.state.dnsServerInProgress );
          _.assign( newNetworkConfig, { dns: { servers: newDNSServers } } );
          if ( _.has( this, [ "state", "networkConfig" ] ) ) {
            newNetworkConfig = _.merge( _.cloneDeep( this.state.networkConfig )
                                      , newNetworkConfig
                                      );
          }
        }
      }
    }

    if ( !_.isEmpty( newNetworkConfig ) ) {
      this.setState( { dnsServerInProgress: ""
                     , networkConfig: newNetworkConfig }
                   , function scrollDNSList () {
                     React.findDOMNode( this.refs["dns-server-list"] ).scrollTop = 1000000;
                   } );
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
      networkConfig = _.merge( _.cloneDeep( this.state.networkConfig )
                             , networkConfig
                             , function mergeDNSHard ( newValue ) {
                               return newValue;
                             }
                             );
      _.pullAt( networkConfig.dns.servers, index );
    } else {
      networkConfig = { dns: { servers: this.props.networkConfig.dns.servers.slice() } };
      if ( _.has( this, [ "state", "networkConfig" ] ) ) {
        networkConfig = _.merge( _.cloneDeep( this.state.networkConfig )
                               , networkConfig
                               , function mergeDNSHard ( newValue ) {
                                 return newValue;
                               }
                               );
      }
      _.pullAt( networkConfig.dns.servers, index );
    }

    if ( !_.isEmpty( networkConfig ) ) {
      this.setState( { networkConfig: networkConfig } );
    }
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
    var hostnameValue = "";
    var ipv4Gateway = null;
    var ipv4GatewayValue = "";
    var ipv6Gateway = null;
    var ipv6GatewayValue = "";
    var dnsServers = [];
    var dnsNodes = null;
    var newDNSInput = null;
    var formControlButtons = null;

    if ( _.has( this, [ "state", "systemGeneralConfig", "hostname" ] ) ) {
      hostnameValue = this.state.systemGeneralConfig.hostname;
    } else if ( _.has( this, [ "props", "systemGeneralConfig", "hostname" ] ) ) {
      hostnameValue = this.props.systemGeneralConfig.hostname;
    }
    hostname =
      <div>
        <Col md = { 4 }
                  sm = { 5 }>
          { "Hostname" }
        </Col>
        <Col md = { 8 }
                  sm = { 7 }>
          <Input
            type = "text"
            ref = "hostname"
            value = { hostnameValue }
            bsStyle = { this.validate( "hostname", hostnameValue ) }
            onBlur = { this.resetFocus.bind( null, "hostname" ) }
            onKeyDown = { this.advanceCursor.bind( this, "hostname" ) }
            onChange = { this.handleChange.bind( this, "hostname" ) } />
        </Col>
      </div>;

    if ( _.has( this, [ "state", "networkConfig", "gateway", "ipv4" ] ) ) {
      ipv4GatewayValue = this.state.networkConfig.gateway.ipv4;
    } else if ( _.has( this, [ "props", "networkConfig", "gateway", "ipv4" ] ) ) {
      ipv4GatewayValue = this.props.networkConfig.gateway.ipv4;
    }
    ipv4Gateway =
      <div>
        <Col md = { 4 }
                  sm = { 5 }>
          { "IPv4 Default Gateway" }
        </Col>
        <Col md = { 8 }
                  sm = { 7 }>
          <Input
            type = "text"
            ref = "ipv4"
            value = { ipv4GatewayValue }
            bsStyle = { this.validate( "ipv4", ipv4GatewayValue ) }
            onBlur = { this.resetFocus.bind( null, "ipv4" ) }
            onKeyDown = { this.advanceCursor.bind( this, "ipv4" ) }
            onChange = { this.handleChange.bind( this, "ipv4" ) } />
        </Col>
      </div>;

    if ( _.has( this, [ "state", "networkConfig", "gateway", "ipv6" ] ) ) {
      ipv6GatewayValue = this.state.networkConfig.gateway.ipv6;
    } else if ( _.has( this, [ "props", "networkConfig", "gateway", "ipv6" ] ) ) {
      ipv6GatewayValue = this.props.networkConfig.gateway.ipv6;
    }
    ipv6Gateway =
      <div>
        <Col
          md = { 4 }
          sm = { 5 }>
          { "IPv6 Default Gateway" }
        </Col>
        <Col
          md = { 8 }
          sm = { 7 }>
          <Input
            type = "text"
            ref = "ipv6"
            value = { ipv6GatewayValue }
            bsStyle = { this.validate( "ipv6", ipv6GatewayValue ) }
            onBlur = { this.resetFocus.bind( null, "ipv6" ) }
            onKeyDown = { this.advanceCursor.bind( this, "ipv6" ) }
            onChange = { this.handleChange.bind( this, "ipv6" ) } />
        </Col>
      </div>;

    if ( _.has( this, [ "state", "networkConfig", "dns", "servers" ] ) ) {
      dnsServers = this.state.networkConfig.dns.servers.slice();
    } else if ( _.has( this, [ "props", "networkConfig", "dns", "servers" ] ) ) {
      dnsServers = this.props.networkConfig.dns.servers.slice();
    }
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
                <Button
                  className = "pull-right"
                  onClick = { this.deleteDnsServer.bind( null, index ) }
                  bsStyle = "danger"
                  bsSize  = "xsmall"
                  title   = "Delete Server">
                  <Icon glyph="times" />
                </Button>
              </div>
            );
          }
          , this
          )
        }
      </div>;

    newDNSInput =
      <Input
        type = "text"
        ref = "dns"
        // hasFeedback
        value = { this.state.dnsServerInProgress }
        // bsStyle = { this.validate( "dns", newDNSServer ) }
        // onBlur = { this.resetFocus.bind( null, "dns" ) }
        onChange = { this.handleChange.bind( this, "dns" ) }
        onKeyDown = { this.addDNSServer }
        placeholder = "Enter new DNS server" />;

    // TODO: Properly disable these when there's nothing to submit
    formControlButtons =
      <ButtonToolbar className = "pull-right">
        <Button
          bsStyle = "default"
          onClick = { this.resetAll }>
          { "Reset" }
        </Button>
        <Button
          bsStyle = "primary"
          onClick = { this.submit } >
          { "Apply" }
        </Button>
      </ButtonToolbar>;

    return (
      <form className = "network-overview">
        <h3 className = "text-center">Network Configuration</h3>
        <Grid fluid>
          <Row>
            <Col
              md = { 12 }
              lg = { 6 } >
              { hostname }
              { ipv4Gateway }
              { ipv6Gateway }
            </Col>
            <Col
              md = { 8 }
              lg = { 6 } >
              <Col xs = { 12 } >
                <h5>DNS Servers</h5>
              </Col>
              <Col xs = { 12 }
                        className = "dns-section"
                        ref = "dns-section">
                { dnsNodes }
                <Row>
                  <Col sm = { 9 } >
                    { newDNSInput }
                  </Col >
                </Row>
              </Col>
            </Col>
          </Row>
          <Row>
            <Col xs = { 12 }>
              { formControlButtons }
            </Col>
          </Row>
        </Grid>
      </form>
    );
  }
});

export default NetworkConfig;
