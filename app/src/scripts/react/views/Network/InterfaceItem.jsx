// Interface Item
// ==============
// Renders a representation of a single network interface.

"use strict";

import React from "react";
import _ from "lodash";
import TWBS from "react-bootstrap";

import IM from "../../../flux/middleware/InterfacesMiddleware";

const InterfaceItem = React.createClass(
  { propTypes: { interface: React.PropTypes.object.isRequired }

  , showAliases: function () {

    var aliases = []

    if ( this.props.interface ) {
      aliases = _.map( this.props.interface[ "status" ][ "aliases" ]
                     , function createAliasSections ( alias, index ) {
                       let interfaceType = "";
                       let broadcast = null;
                       let netmask = null;


                       switch( alias[ "family" ] ) {
                         case "LINK":
                           interfaceType = "MAC Address";
                           break;

                         case "INET":
                           interfaceType = "IPv4 Address"
                           break;

                         case "INET6":
                           interfaceType = "IPv6 Address"
                           break;

                         default:
                           break;
                       }

                       if ( alias[ "netmask" ] ) {
                         netmask = <div>{ "Netmask: /"}{ alias[ "netmask" ] }</div>
                       }

                       if ( alias[ "broadcast" ] ) {
                         broadcast = <div>{ "Broadcast: "}{ alias[ "broadcast" ] }</div>
                       }

                       return (
                         <TWBS.Panel header = { interfaceType }
                                     key = { index }>
                           <div>{ "Address: " }{ alias[ "address" ] }</div>
                           { netmask }
                           { broadcast }
                         </TWBS.Panel>
                       )
                     } )
    }
    return (
      { aliases }
    );
  }

  , render: function () {

    var statusClass = "";
    var interfaceName = null;
    var interfaceType = "";
    var enabled = this.props.interface
                ? this.props.interface[ "enabled" ]
                : false;

    // This all breaks if the interface isn't yet loaded.
    if ( this.props.interface ) {
      if ( this.props.interface[ "status" ][ "link-state" ]
       === "LINK_STATE_UP" ) {
        statusClass = "interface-up";
      } else if ( this.props.interface[ "status" ][ "link-state" ]
       === "LINK_STATE_UNKNOWN" ) {
        statusClass = "interface-unknown";
      } else if ( this.props.interface[ "status" ][ "link-state" ]
       === "LINK_STATE_DOWN" ) {
        statusClass = "interface-down";
      }

      interfaceName = (
        <h2 className = { "interface-name " + statusClass } >
          { this.props.interface[ "name" ] }
        </h2>
      );

      // So fake. Just a token use of the middleware.
      interfaceType = this.props.interface[ "type" ] === "ETHER"
                    ? "10/100/1000 Ethernet Adapter"
                    : "";

    }

    return (
      <TWBS.Panel className = "interface-item">
        { interfaceName }
        <h4>{ interfaceType }</h4>
        { this.showAliases() }
      </TWBS.Panel>
    );
  }
});

export default InterfaceItem;
