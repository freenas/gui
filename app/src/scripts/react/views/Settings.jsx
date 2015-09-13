// Settings
// ========
// Display and modify FreeNAS OS and GUI settings.

"use strict";

import React from "react";
import { RouteHandler } from "react-router";

import routerShim from "../mixins/routerShim";
import SectionNav from "../components/SectionNav";

const sections = [ { route: "system"
                   , display: "System"
                   }
                 , { route: "update"
                   , display: "Updates"
                   }
                 , { route: "security"
                   , display: "Security"
                   }
                 , { route: "alerts"
                   , display: "Alerts"
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
        <h1 className="section-heading heading-with-nav">
          <span className="text">System Settings</span>
          <SectionNav
            bs-size = "md"
            views = { sections }
          />
        </h1>
        <RouteHandler />
      </main>
    );
  }
});

export default Settings;
