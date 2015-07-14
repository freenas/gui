// Hardware
// ========
// Information and settings that pertain directly to the physical hardware of
// the machine - UPS settings, firmware, enclosures, disks, etc.

"use strict";

import React from "react";

import { RouteHandler } from "react-router";

import routerShim from "../components/mixins/routerShim";

import SectionNav from "../components/SectionNav";

const sections = [ { route: "update"
                   , display: "Update"
                   , disabled: false
                   }
                 , { route: "power"
                   , display: "Power"
                   , disabled: false
                   }
                 ];

const Hardware = React.createClass({
  displayName: "Hardware"

  , mixins: [ routerShim ]

  , render: function () {
    return (
      <main>
        <SectionNav views = { sections } />
        <RouteHandler />
      </main>
    );
  }
});

export default Hardware;
