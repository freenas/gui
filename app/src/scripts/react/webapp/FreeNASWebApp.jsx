// Main App Wrapper
// ================
// Top level controller-view for FreeNAS webapp

"use strict";

import React from "react";

import { RouteHandler } from "react-router";

import routerShim from "../mixins/routerShim";

// WebApp Components
import BusyBox from "../components/BusyBox";
import NotificationBar from "./NotificationBar";
import ContextBar from "./ContextBar";
import PrimaryNavigation from "./PrimaryNavigation";
import DebugTools from "./DebugTools";

// Static Assets
if ( process.env.BROWSER ) {
  require( "../../../styles/core.less" );
}

const FreeNASWebApp = React.createClass(
  { mixins: [ routerShim ]

  , getInitialState () {
      return { cssBust: ""
             };
    }

  , componentDidMount () {
      if ( module.hot ) {
        module.hot.addStatusHandler( this.cssBust );
      }
      this.calculateDefaultRoute( "/", "accounts", "is" );
      window.addEventListener( "click", this.handleMenuClickOut );
    }

  , componentDidUpdate ( prevProps, prevState ) {
      this.calculateDefaultRoute( "/", "accounts", "is" );
      window.removeEventListener( "click", this.handleMenuClickOut );
    }

  , componentWillUnmount () {
      if ( module.hot ) {
        module.hot.removeStatusHandler( this.cssBust );
      }
    }

  , cssBust ( hmrState ) {
      if ( hmrState === "idle" ) {
        this.setState(
          { cssBust: "?" + new Date().getTime() / 1000
          }
        );
      }
    }

  , getParent( child, testClass ) {
      let parent = null;

      if ( child ) {
        parent = testClass
               ? ( child.parentNode.classList.contains( testClass )
                 ? child.parentNode
                 : null
                 )
               : child.parentNode;
      }

      return parent;
    }

  , handleMenuClickOut ( event ) {
      // FIXME: Remove this once react-bootstrap reaches 1.0
      if ( event.target.tagName === "A" ) {
        let li = this.getParent( event.target );
        let ul = this.getParent( li, "dropdown-menu" );
        let openGroup = this.getParent( ul, "open" );

        if ( openGroup ) {
          document.body.click();
        }
      }
    }

  , render: function () {
    return (
    <html>
      <head>
        {/* Charset Definition */}
        <meta charSet="utf-8"/>
        <title>FreeNAS 10 GUI</title>

        {/* Robot Instructions */}
        <meta name="robots" content="noindex, nofollow" />

        {/* Favicons */}
        <link
          rel   = "icon"
          type  = "image/png"
          href  = "/favicon-32x32.png"
          sizes = "32x32"
        />
        <link
          rel   = "icon"
          type  = "image/png"
          href  = "/favicon-16x16.png"
          sizes = "16x16"
        />

        {/* Primary Styles */}
        <link rel="stylesheet" type="text/css" href={ "/extract.css" + this.state.cssBust } />
        <script type="text/javascript" src="/js/data-window-props.js"></script>
      </head>
      <body>
        {/* TODO: Add Modal mount div */}

        {/* Modal windows for busy spinner and/or FreeNAS login.
            Hidden normally except when invoked
        */}
        <BusyBox />

        {/* Header containing system status and information */}
        <NotificationBar />

        <div className="app-content">
          {/* Primary navigation menu */}
          <PrimaryNavigation />

          {/* Primary view */}
          <RouteHandler />

          {/* User-customizable component showing system events */}
          <ContextBar />
        </div>

        <footer className="app-footer">
        </footer>

        <DebugTools />

        {/* Main app code */}
        <script type="text/javascript" src="/js/app.js"></script>
      </body>
    </html>
    );
  }

  }
);

export default FreeNASWebApp;
