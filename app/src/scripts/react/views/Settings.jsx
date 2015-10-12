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
                   , disabled: true
                   }
                 , { route: "alerts"
                   , display: "Alerts"
                   , disabled: true
                   }
                 , { route: "support"
                   , display: "Support"
                   , disabled: true
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
        <div className="view-header heading-with-nav">
          <h1 className="section-heading">
            <span className="text">System Settings</span>
          </h1>
          <SectionNav
            bs-size = "md"
            views = { sections }
          />
        </div>
        { this.props.children }
      </main>
    );
  }
});

export default Settings;
