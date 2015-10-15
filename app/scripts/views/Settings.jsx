// Settings
// ========
// Display and modify FreeNAS OS and GUI settings.

"use strict";

import React from "react";

import routerShim from "../mixins/routerShim";
import SectionNav from "../components/SectionNav";

// STYLESHEET
if ( process.env.BROWSER ) require( "./Settings.less" );


const sections = [ { route: "/settings/system"
                   , display: "System"
                   }
                 , { route: "/settings/update"
                   , display: "Updates"
                   }
                 , { route: "/settings/security"
                   , display: "Security"
                   , disabled: true
                   }
                 , { route: "/settings/alerts"
                   , display: "Alerts"
                   , disabled: true
                   }
                 , { route: "/settings/support"
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
