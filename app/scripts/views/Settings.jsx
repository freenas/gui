// Settings
// ========
// Display and modify FreeNAS OS and GUI settings.

"use strict";

import React from "react";

// Commented per note below
// import { History } from "react-router";

import SectionNav from "../components/SectionNav";

// STYLESHEET
if ( process.env.BROWSER ) require( "./Settings.less" );


const sections = [ { route: "/settings/system"
                   , display: "System"
                   }
                 , { route: "/settings/sharing"
                   , display: "Sharing"
                   }
                 , { route: "/settings/distributed"
                   , display: "Distributed"
                   }
                 , { route: "/settings/update"
                   , display: "Updates"
                   }
                 , { route: "/settings/security"
                   , display: "Security"
                   }
                 ];

const Settings = React.createClass(
  { // Commented this all out because it's fixing a problem with no immediate
    // harm. Leaving it here in case we decide to give a shit and there turn out
    // not to be serious side effects. Warning: code copy-pasted from Accounts.
  /*mixins: [ History ]

  , componentDidMount () {
      this.redirectToSystem();
    }

  , componentWillUpdate ( prevProps, prevState ) {
      this.redirectToSystem();
    }

    // This is dumb. Stupid "temporary" (hah) hack because we updated
    // react-router too soon. And yet still better than the old thing.
  , redirectToSystem () {
    if ( this.props.location.pathname.endsWith( "settings" )
      || this.props.location.pathname.endsWith( "settings/" )
       ) {
      this.history.pushState( null, "/settings/system" );
    }
  }

  ,*/ render () {
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
