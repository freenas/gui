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
               , addresses: []
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
    return { dnsAddressInProgress: "" };
  }

  // Totally wipes out config changes in state.
  // TODO: Use this function to create the conflict state.
  /*, componentWillReceiveProps ( nextProps ) {
    this.replaceState( { dnsAddressInProgress: this.state.dnsAddressInProgress } );
  }*/

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
        this.setState( { dnsAddressInProgress: evt.target.value } );
        break;

      case "dhcpAssignDNS":
        networkConfig = { dhcp: { assign_dns: evt.target.checked } };
        if ( _.has( this, [ "state", "networkConfig" ] ) ) {
          networkConfig = _.defaultsDeep( networkConfig
                                        , this.state.networkConfig
                                        );
        }
        break;

      case "dhcpAssignGateway":
        networkConfig = { dhcp: { assign_gateway: evt.target.checked } };
        if ( _.has( this, [ "state", "networkConfig" ] ) ) {
          networkConfig = _.defaultsDeep( networkConfig
                                        , this.state.networkConfig
                                        );
        }
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
      && this.isHostname( this.state.systemGeneralConfig.hostname )
       ) {
      newSystemGeneralConfig.hostname =
        this.state.systemGeneralConfig.hostname;
    }

    if ( _.has( this, [ "state", "networkConfig", "gateway", "ipv4" ] )
      && this.isIPv4( this.state.networkConfig.gateway.ipv4 )
       ) {
      newNetworkConfig =
        { gateway: { ipv4: this.state.networkConfig.gateway.ipv4 } };
    }

    if ( _.has( this, [ "state", "networkConfig", "gateway", "ipv6" ] )
      && this.isIPv6( this.state.networkConfig.gateway.ipv6 )
       ) {
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
          { dns: { addresses: this.state.networkConfig.dns.addresses } };
      } else {
        _.assign( newNetworkConfig
                , { dns: { addresses: this.state.networkConfig.dns.addresses } } );
      }
    }

    // handle a valid DNS address in the entry field
    // TODO: safely remove it from state when doing this
    if ( _.has( this, [ "state", "dnsAddressInProgress" ] )
      && ( this.isIPv4( this.state.dnsAddressInProgress )
        || this.isIPv6( this.state.dnsAddressInProgress )
         )
      ) {
      if ( _.has( newNetworkConfig, [ "dns", "addresses" ] ) ) {
        let newDNSAddresses = newNetworkConfig.dns.addresses.slice();
        newDNSAddresses.push( this.state.dnsAddressInProgress );
        _.assign( newNetworkConfig, { dns: { addresses: newDNSAddresses } } );
      } else {
        let newDNSAddresses = this.props.networkConfig.dns.addresses.slice();
        newDNSAddresses.push( this.state.dnsAddressInProgress );
        _.assign( newNetworkConfig, { dns: { addresses: newDNSAddresses } } );
      }
    }

    if ( _.has( this, [ "state", "networkConfig", "dhcp", "assign_dns" ] ) ) {
      if ( !_.isEmpty( newNetworkConfig ) ) {
        newNetworkConfig =
          { dhcp: { assign_dns: this.state.networkConfig.dhcp.assign_dns } };
      } else {
        _.assign( newNetworkConfig
                , { dhcp: { assign_dns: this.state.networkConfig.dhcp.assign_dns } }
                );
      }
    }

    if ( _.has( this, [ "state", "networkConfig", "dhcp", "assign_gateway" ] ) ) {
      if ( !_.isEmpty( newNetworkConfig ) ) {
        newNetworkConfig =
          { dhcp: { assign_gateway: this.state.networkConfig.dhcp.assign_gateway } };
      } else {
        _.assign( newNetworkConfig
                , { dhcp: { assign_gateway: this.state.networkConfig.dhcp.assign_gateway } }
                );
      }
    }

    if ( !_.isEmpty( newNetworkConfig ) ) {
      NM.updateNetworkConfig( newNetworkConfig );
    }

    if ( !_.isEmpty( newSystemGeneralConfig ) ) {
      SM.updateSystemGeneralConfig( newSystemGeneralConfig );
    }
  }
/*
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
*/
  , addDNSServer ( evt ) {
    var newNetworkConfig = {};
    var newDNSAddresses = [];
    if ( evt.key === "Enter" ) {
      if ( this.isIPv4( this.state.dnsAddressInProgress )
        || this.isIPv6( this.state.dnsAddressInProgress )
         ) {
        if ( _.has( this, [ "state", "networkConfig", "dns", "addresses" ] ) ) {
          newDNSAddresses = this.state.networkConfig.dns.addresses.slice();
          newDNSAddresses.push( this.state.dnsAddressInProgress );
          _.assign( newNetworkConfig, { dns: { addresses: newDNSAddresses } } );
          newNetworkConfig = _.merge( _.cloneDeep( this.state.networkConfig )
                                    , newNetworkConfig
                                    );
        } else {
          newDNSAddresses = this.props.networkConfig.dns.addresses.slice();
          newDNSAddresses.push( this.state.dnsAddressInProgress );
          _.assign( newNetworkConfig, { dns: { addresses: newDNSAddresses } } );
          if ( _.has( this, [ "state", "networkConfig" ] ) ) {
            newNetworkConfig = _.merge( _.cloneDeep( this.state.networkConfig )
                                      , newNetworkConfig
                                      );
          }
        }
      }
    }

    if ( !_.isEmpty( newNetworkConfig ) ) {
      this.setState( { dnsAddressInProgress: ""
                     , networkConfig: newNetworkConfig }
                   , function scrollDNSList () {
                     React.findDOMNode( this.refs["dns-server-list"] ).scrollTop = 1000000;
                   } );
    }
  }

  /**
   * Delete a DNS server.
   * @param  {int} index The index of server to delete in the dns.addresses array.
   */
  , deleteDnsServer ( index ) {
    var networkConfig = {};
    if ( _.has( this, [ "state", "networkConfig", "dns", "addresses" ] ) ) {
      networkConfig = { dns: { addresses: this.state.networkConfig.dns.addresses.slice() } };
      networkConfig = _.merge( _.cloneDeep( this.state.networkConfig )
                             , networkConfig
                             );
      _.pullAt( networkConfig.dns.addresses, index );
    } else {
      networkConfig = { dns: { addresses: this.props.networkConfig.dns.addresses.slice() } };
      if ( _.has( this, [ "state", "networkConfig" ] ) ) {
        networkConfig = _.merge( _.cloneDeep( this.state.networkConfig )
                               , networkConfig
                               );
      }
      _.pullAt( networkConfig.dns.addresses, index );
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
          && !this.isIPv6( value )
          && ( _.has( this, [ "state", "networkConfig", "dns", "addresses" ] ) )
           ) {
          responseStyle = "error";
        }
        break;
    }

    return responseStyle;
  }

  , resetAll () {
    this.setState( { networkConfig: {}
                   , systemGeneralConfig: {}
                   , updatedDNS: false
                   }
                 );
  }

  , render () {
    let formClasses =
      { labelClassName: "col-xs-4"
      , wrapperClassName: "col-xs-8"
      };

    var hostnameValue = "";
    var ipv4GatewayValue = "";
    var ipv6GatewayValue = "";
    var dhcpAssignDNSValue = false;
    var dhcpAssignGatewayValue = false;

    var dnsAddresses = [];
    var dnsNodes = null;
    var newDNSInput = null;

    if ( _.has( this, [ "state", "systemGeneralConfig", "hostname" ] ) ) {
      hostnameValue = this.state.systemGeneralConfig.hostname;
    } else if ( _.has( this, [ "props", "systemGeneralConfig", "hostname" ] ) ) {
      hostnameValue = this.props.systemGeneralConfig.hostname;
    }

    if ( _.has( this, [ "state", "networkConfig", "gateway", "ipv4" ] ) ) {
      ipv4GatewayValue = this.state.networkConfig.gateway.ipv4;
    } else if ( _.has( this, [ "props", "networkConfig", "gateway", "ipv4" ] ) ) {
      ipv4GatewayValue = this.props.networkConfig.gateway.ipv4;
    }

    if ( _.has( this, [ "state", "networkConfig", "gateway", "ipv6" ] ) ) {
      ipv6GatewayValue = this.state.networkConfig.gateway.ipv6;
    } else if ( _.has( this, [ "props", "networkConfig", "gateway", "ipv6" ] ) ) {
      ipv6GatewayValue = this.props.networkConfig.gateway.ipv6;
    }

    if ( _.has( this, [ "state", "networkConfig", "dns", "addresses" ] ) ) {
      dnsAddresses = this.state.networkConfig.dns.addresses.slice();
    } else if ( _.has( this, [ "props", "networkConfig", "dns", "addresses" ] ) ) {
      dnsAddresses = this.props.networkConfig.dns.addresses.slice();
    }

    if ( _.has( this, [ "state", "networkConfig", "dhcp", "assign_dns" ] ) ) {
      dhcpAssignDNSValue = this.state.networkConfig.dhcp.assign_dns;
    } else if ( _.has( this, [ "props", "networkConfig", "dhcp", "assign_dns" ] ) ) {
      dhcpAssignDNSValue = this.props.networkConfig.dhcp.assign_dns;
    }

    if ( _.has( this, [ "state", "networkConfig", "dhcp", "assign_gateway" ] ) ) {
      dhcpAssignGatewayValue = this.state.networkConfig.dhcp.assign_gateway;
    } else if ( _.has( this, [ "props", "networkConfig", "dhcp", "assign_gateway" ] ) ) {
      dhcpAssignGatewayValue = this.props.networkConfig.dhcp.assign_gateway;
    }

    dnsNodes =
      <div className = "dns-server-list"
           ref = "dns-server-list">
        { _.map(
          dnsAddresses
          , function mapDNSAddresses ( server, index ) {
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
        value = { this.state.dnsAddressInProgress }
        // bsStyle = { this.validate( "dns", newDNSServer ) }
        onChange = { this.handleChange.bind( this, "dns" ) }
        onKeyDown = { this.addDNSServer }
        placeholder = "Enter new DNS server" />;

    return (
      <Grid
        fluid
        className = "network-overview"
      >

        <Row className="well">
          <Col
            lg = { 6 }
            md = { 12 }
          >
            <form className="form-horizontal">
              <Input { ...formClasses }
                type = "text"
                ref = "hostname"
                label = "Hostname"
                value = { hostnameValue }
                bsStyle = { this.validate( "hostname", hostnameValue ) }
                //onKeyDown = { this.advanceCursor.bind( this, "hostname" ) }
                onChange = { this.handleChange.bind( this, "hostname" ) }
              />
              <Input { ...formClasses }
                type = "text"
                ref = "ipv4"
                label = "IPv4 Default Gateway"
                value = { ipv4GatewayValue }
                bsStyle = { this.validate( "ipv4", ipv4GatewayValue ) }
                //onKeyDown = { this.advanceCursor.bind( this, "ipv4" ) }
                onChange = { this.handleChange.bind( this, "ipv4" ) }
              />
              <Input { ...formClasses }
                type = "text"
                ref = "ipv6"
                label = "IPv6 Default Gateway"
                value = { ipv6GatewayValue }
                bsStyle = { this.validate( "ipv6", ipv6GatewayValue ) }
                //onKeyDown = { this.advanceCursor.bind( this, "ipv6" ) }
                onChange = { this.handleChange.bind( this, "ipv6" ) }
              />
            </form>
          </Col>

          <Col
            lg = { 6 }
            md = { 12 }
          >
            <h5>DNS Addresses</h5>
            <Col
              xs = { 12 }
              className = "dns-section"
              ref = "dns-section"
            >
              { dnsNodes }
              <Row>
                <Col sm = { 9 } >
                  { newDNSInput }
                </Col >
              </Row>
            </Col>
          </Col>
          <Col xs={3}>
            <Input
              type = "checkbox"
              label = "dhcp Assign DNS"
              checked = { dhcpAssignDNSValue }
              onChange = { this.handleChange.bind( this, "dhcpAssignDNS" ) }
            />
          </Col>
          <Col xs={3}>
            <Input
              type = "checkbox"
              label = "dhcp Assign Gateway"
              checked = { dhcpAssignGatewayValue }
              onChange = { this.handleChange.bind( this, "dhcpAssignGateway" ) }
            />
          </Col>
          <Col xs={ 12 }>
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
            </ButtonToolbar>
          </Col>
        </Row>
      </Grid>
    );
  }
});

export default NetworkConfig;
