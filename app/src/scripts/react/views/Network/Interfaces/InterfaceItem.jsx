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

  , getInitalState: function () {
    return (
      { targetInterface: this.getInterface()
      , activeRoute: this.getDynamicRoute()
      }
    );
  }

  , getInterface: function () {
    return { targetInterface: IS.getInterface( this.getDynamicRoute ) };
  }

  , render: function () {
    return null;
  }
});

export default InterfaceItem;
