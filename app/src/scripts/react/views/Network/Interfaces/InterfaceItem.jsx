// Interface Item
// ==============
// Renders a representation of a single network interface.

"use strict";

import React from "react";
import _ from "lodash";
import TWBS from "react-bootstrap";

import routerShim from "../../../mixins/routerShim";

import IS from "../../../../flux/stores/InterfacesStore";
import IM from "../../../../flux/middleware/InterfacesMiddleware";

const InterfaceItem = React.createClass(
  { mixins: [ routerShim ]

  , getInitialState: function () {
    return (
      { targetInterface: this.getInterface()
      , activeRoute: this.getDynamicRoute()
      }
    );
  }

  , componentDidMount: function () {
    IS.addChangeListener( this.handleInterfaceChange );
  }

  , componentWillUnmount: function () {
    IS.removeChangeListener( this.handleInterfaceChange );
  }

  , handleInterfaceChange: function () {
    this.setState( { targetInterface: this.getInterface() } );
  }

  , getInterface: function () {
    return IS.findInterfaceByKeyValue( "name", this.getDynamicRoute() );
  }

  , render: function () {

    var statusClass = "";
    var interfaceName = null;
    var interfaceType = "";
    var enabled = this.state.targetInterface
                ? this.state.targetInterface[ "enabled" ]
                : false;

    // This all breaks if the interface isn't yet loaded.
    if ( this.state.targetInterface ) {
      if ( this.state.targetInterface[ "status" ][ "link-state" ]
       === "LINK_STATE_UP" ) {
        statusClass = "interface-up";
      } else if ( this.state.targetInterface[ "status" ][ "link-state" ]
       === "LINK_STATE_UNKNOWN" ) {
        statusClass = "interface-unknown";
      } else if ( this.state.targetInterface[ "status" ][ "link-state" ]
       === "LINK_STATE_DOWN" ) {
        statusClass = "interface-down";
      }

      interfaceName = (
        <h2 className = { "interface-name " + statusClass } >
          { this.state.targetInterface[ "name" ] }
        </h2>
      );

      // So fake. Just a token use of the middleware.
      interfaceType = this.state.targetInterface[ "type" ] === "ETHER"
                    ? "10/100/1000 Ethernet Adapter"
                    : "";

      // This could be much more robust.
    }

    return (
      <TWBS.Grid className = "viewer-item-info interface-item">
        <TWBS.Row className = "interface-header" >
          <TWBS.Col xs = {12} >
            { interfaceName }
            <h4>{ interfaceType }</h4>
          </TWBS.Col>
        </TWBS.Row>
      </TWBS.Grid>
    );
  }
});

export default InterfaceItem;
