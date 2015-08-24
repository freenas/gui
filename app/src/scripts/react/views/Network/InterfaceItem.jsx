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
  { propTypes: { interface: React.PropTypes.object.isRequired }

  , showAliases () {

    var aliases = []

    if ( this.props.interface ) {
      aliases = _.map( this.props.interface[ "status" ][ "aliases" ]
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
    if ( this.props.interface[ "status" ][ "link-state" ] === "LINK_STATE_UP" ) {
      IM.downInterface( this.props.interface.name );
    } else {
      IM.upInterface( this.props.interface.name );
    }
  }

  , handleStaticIPChange () {

  }

  , toggleDHCP () {
    var newInterface = {}
    if ( this.props.interface.dhcp ) {
      newInterface = { dhcp: false };
    } else {
      newInterface = { dhcp: true };
    }
    IM.configureInterface( this.props.interface.name, newInterface );
  }

  , render () {

    var statusClass = "";
    var interfaceName = null;
    var interfaceType = "";
    var linkSpeed = null;
    var enabled = this.props.interface
                ? this.props.interface[ "enabled" ]
                : false;
    var interfaceToggle = null;
    var staticIP = null;
    var dhcpToggle = null;

    // This all breaks if the interface isn't yet loaded.
    if ( this.props.interface ) {
      if ( this.props.interface[ "status" ][ "link-state" ]
       === "LINK_STATE_UP" ) {
        statusClass = "interface-up";
        linkSpeed =
          <h4>
            { "10/100/" }
            <strong className = "bg-primary" >{ "1000" }</strong>
            { " Ethernet Adapter" }
          </h4>
      } else if ( this.props.interface[ "status" ][ "link-state" ]
       === "LINK_STATE_UNKNOWN" ) {
        statusClass = "interface-unknown";
        linkSpeed = <h4>{ "10/100/1000 Ethernet Adapter" }</h4>
      } else if ( this.props.interface[ "status" ][ "link-state" ]
       === "LINK_STATE_DOWN" ) {
        statusClass = "interface-down";
        linkSpeed = <h4>{ "10/100/1000 Ethernet Adapter" }</h4>
      }

      interfaceName = (
        <h2 className = { "interface-name " + statusClass } >
          { this.props.interface[ "name" ] }
        </h2>
      );

      interfaceToggle = (
        <ToggleSwitch
          className = "pull-right"
          toggled = { this.props.interface[ "status" ][ "link-state" ]
                  === "LINK_STATE_UP" }
          onChange = { this.toggleInterface.bind( this
                                                , this.props.interface.name
                                                ) } />
      );

      staticIP =
        <TWBS.Input
          type = "text"
          label = "Static IP:"
          onChange = { this.handleStaticIPChange }
          disabled = { this.props.interface.dhcp } />

      dhcpToggle =
        <TWBS.Input
          type = "checkbox"
          checked = { this.props.interface.dhcp }
          onChange = { this.toggleDHCP }
          label = { "Enable DHCP" }
          disabled = { this.props.interface[ "status" ][ "link-state" ]
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
