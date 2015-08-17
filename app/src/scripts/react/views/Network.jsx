// Network
// =======

"use strict";

import React from "react";

import { RouteHandler } from "react-router";

import routerShim from "../mixins/routerShim";

import SectionNav from "../components/SectionNav";

const sections = [ { route: "network-config"
                   , display: "General Config"
                   }
                 , { route: "interfaces"
                   , display: "Network Interfaces"
                   } ];

const Network = React.createClass(
  { mixins: [ routerShim ]

  , componentDidMount: function () {
    this.calculateDefaultRoute( "network", "network-config", "endsWith" );
  }

  , componentWillUpdate: function ( prevProps, prevState ) {
    this.calculateDefaultRoute( "network", "network-config", "endsWith" );
  }

  , render: function () {
    return (
      <main>
        <SectionNav views = { sections } />
        <RouteHandler />
      </main>
    );
  }
});

export default Network;
