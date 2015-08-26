// Settings
// ========
// Display and modify FreeNAS OS and GUI settings.

"use strict";

import React from "react";
import { RouteHandler } from "react-router";

import routerShim from "../mixins/routerShim";
import SectionNav from "../components/SectionNav";

const sections = [ { route: "system"
                   , display: "System Settings"
                   }
                 , { route: "update"
                   , display: "Updates and Boot Environments"
                   }
                 , { route: "security"
                   , display: "Security Certificates"
                   }
                 , { route: "support"
                   , display: "Support"
                   }
                 ];

const Settings = React.createClass(
  { mixins: [ routerShim ]

  , componentDidMount () {
    this.calculateDefaultRoute( "settings", "system", "endsWith" );
  }

  , componentWillUpdate ( prevProps, prevState ) {
    this.calculateDefaultRoute( "settings", "system", "endsWith" );
  }

  , render () {
    return (
      <main>
        <SectionNav views = { sections } />
        <RouteHandler />
      </main>
    );
  }
});

export default Settings;
