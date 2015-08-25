// Interface Item
// ==============
// Renders a representation of a single network interface.

"use strict";

import React from "react";
import _ from "lodash";
import TWBS from "react-bootstrap";

import ToggleSwitch from "../../components/ToggleSwitch";

import IM from "../../../flux/middleware/InterfacesMiddleware";

const InterfaceItem = React.createClass(
  { propTypes: { networkInterface: React.PropTypes.object.isRequired }

  , getInitialState () {
    // 'staticIP' is just the string in the static IP field while it is being
    // edited. The actual static IP that is committed will be parsed from it.
    return { staticIP: null };
  }

  , showAliases () {

    var aliases = []

    if ( this.props.networkInterface ) {
      aliases = _.map( this.props.networkInterface[ "status" ][ "aliases" ]
                     , function createAliasSections ( alias, index ) {
                       let broadcast = null;
                       let netmask = null;
                       let addressLabel = "";
                       let address = null;

                       switch( alias[ "family" ] ) {
                         case "LINK":
                           addressLabel = "MAC: ";
                           break;

                         case "INET":
                           addressLabel = "IPv4: "
                           break;

                         case "INET6":
                           addressLabel = "IPv6: "
                           break;

                         default:
                           break;
                       }

                       address = <div>
                                   <span className = "alias-attribute-label">
                                     { addressLabel }
                                   </span>
                                   <span className = "alias-attribute">
                                     { alias[ "address" ] }
                                   </span>
                                 </div>;

                       if ( alias[ "netmask" ] ) {
                         netmask = <div>
                                     <span className = "alias-attribute-label">
                                       { "Netmask:" }
                                     </span>
                                     <span className = "alias-attribute">
                                       { " /" + alias[ "netmask" ] }
                                     </span>
                                   </div>;
                       }

                       if ( alias[ "broadcast" ] ) {
                         broadcast = <div>
                                       <span className = "alias-attribute-label">
                                         { "Broadcast: "}
                                        </span>
                                       <span className = "alias-attribute">
                                        { alias[ "broadcast" ] }
                                       </span>
                                     </div>;
                       }

                       return (
                         <div key = { index }
                              className = "network-alias">
                          { address }
                          { netmask }
                          { broadcast }
                         </div>
                       )
                     } )
    }
    return (
      { aliases }
    );
  }

  , toggleInterface () {
    if ( this.props.networkInterface[ "status" ][ "link-state" ] === "LINK_STATE_UP" ) {
      IM.downInterface( this.props.networkInterface.name );
    } else {
      IM.upInterface( this.props.networkInterface.name );
    }
  }


  , handleChange ( key, evt ) {
    switch ( key ) {
      case "staticIP":
        this.setState( { staticIP: evt.target.value } );
        break;
    }
  }

  , toggleDHCP () {
    var newNetworkInterface = {};
    if ( this.props.networkInterface.dhcp ) {
      newNetworkInterface = { dhcp: false };
    } else {
      newNetworkInterface = { dhcp: true };
    }
    IM.configureInterface( this.props.networkInterface.name
                         , newNetworkInterface );
  }

  , render () {

    var statusClass = "";
    var interfaceName = null;
    var interfaceType = "";
    var linkSpeed = null;
    var enabled = this.props.networkInterface
                ? this.props.networkInterface[ "enabled" ]
                : false;
    var interfaceToggle = null;
    var staticIP = null;
    var staticIPValue = this.props.networkInterface[ "ipv4-address" ]
                      + "/"
                      + this.props.networkInterface[ "ipv4-netmask" ];
    var dhcpToggle = null;

    // This all breaks if the interface isn't yet loaded.
    if ( this.props.networkInterface ) {
      switch ( this.props.networkInterface[ "status" ][ "link-state" ] ) {

        case "LINK_STATE_UP":
          statusClass = "interface-up";
          linkSpeed =
            <h4>
              { "10/100/" }
              <strong className = "bg-primary" >{ "1000" }</strong >
              { " Ethernet Adapter" }
            </h4>;
          break;

        case "LINK_STATE_UNKNOWN":
          statusClass = "interface-unknown";
          linkSpeed = <h4>{ "10/100/1000 Ethernet Adapter" }</h4>
          break;

        case "LINK_STATE_DOWN":
          statusClass = "interface-down";
          linkSpeed = <h4>{ "10/100/1000 Ethernet Adapter" }</h4>
          break;
      }

      interfaceName = (
        <h2 className = { "interface-name " + statusClass } >
          { this.props.networkInterface[ "name" ] }
        </h2>
      );

      interfaceToggle = (
        <ToggleSwitch
          className = "pull-right"
          toggled = { this.props.networkInterface[ "status" ][ "link-state" ]
                  === "LINK_STATE_UP" }
          onChange = { this.toggleInterface.bind( this
                                                , this.props.networkInterface.name
                                                ) } />
      );

      if ( this.state.staticIP !== null ) {
        staticIPValue = this.state.staticIP;
      }

      staticIP =
        <TWBS.Input
          type = "text"
          label = "Static IP:"
          value = { staticIPValue }
          onChange = { this.handleChange.bind( this, "staticIP" ) }
          disabled = { this.props.networkInterface.dhcp } />

      dhcpToggle =
        <TWBS.Input
          type = "checkbox"
          checked = { this.props.networkInterface.dhcp }
          onChange = { this.toggleDHCP }
          label = { "Enable DHCP" }
          disabled = { this.props.networkInterface[ "status" ][ "link-state" ]
                 !== "LINK_STATE_UP" }/>;

    }

    return (
      <TWBS.Panel className = "interface-item">
        { interfaceName }
        { interfaceToggle }
        { staticIP }
        { dhcpToggle }
        { linkSpeed }
        { this.showAliases() }
      </TWBS.Panel>
    );
  }
});

export default InterfaceItem;
