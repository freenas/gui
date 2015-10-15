// Main App Wrapper
// ================
// Top level controller-view for FreeNAS webapp

"use strict";

import React from "react";
import { RouteHandler } from "react-router";
import { connect } from "react-redux";
import { Motion, spring } from "react-motion";

import * as actions from "../actions/auth";

import ContextBar from "./App/ContextBar";
import PrimaryNavigation from "./App/PrimaryNavigation";
import DebugTools from "./App/DebugTools";
import SessionInterruptDialog from "./App/SessionInterruptDialog";

// PRIMARY STYLESHEET
if ( process.env.BROWSER ) require( "../../styles/core.less" );


// REACT
class App extends React.Component {

  constructor ( props ) {
    super( props );
    this.displayName = "FreeNAS Webapp Root Component";

    this.onHMRChange = this.cssBust.bind( this );

    this.state =
      { cssBust: ""
      };
  }

  componentDidMount () {
    if ( module.hot ) module.hot.addStatusHandler( this.onHMRChange );
  }

  componentWillUnmount () {
    if ( module.hot ) module.hot.removeStatusHandler( this.onHMRChange );
  }

  cssBust ( hmrState ) {
    if ( hmrState === "idle" ) {
      this.setState({ cssBust: `?${ new Date().getTime() / 1000 }` });
    }
  }

  getBlurStyle ( radius ) {
    console.log( radius );
    if ( radius ) {
      return (
        { WebkitFilter: `blur( ${ radius }px )`
        , MozFilter: `blur( ${ radius }px )`
        // TODO: Explorer sucks and doesn't have this functionality. Needs a
        // nice looking workaround.
        // , msFilter: `blur( ${ radius }px )`
        , OFilter: `blur( ${ radius }px )`
        , filter: `blur( ${ radius }px )`
        }
      );
    } else {
      return {};
    }
  }

  render () {
    console.log( this.props );
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
          <link
            rel  = "stylesheet"
            type = "text/css"
            href = { "/extract.css" + this.state.cssBust }
          />
          <script type="text/javascript" src="/js/data-window-props.js"></script>
        </head>
        <body>
          {/* Modal windows for busy spinner and/or FreeNAS login. */}
          <SessionInterruptDialog />

            <Motion
              defaultStyle = {{ blur: 0 }}
              style = {{ blur: spring( this.props.showSID ? 100 : 0 )}}
            >
              { ({ blur }) =>

                <div
                  className="app-content"
                  style = { this.getBlurStyle( blur ) }
                >
                  {/* Primary navigation menu */}
                  <PrimaryNavigation />

                  <div className="app-view">
                    {/* Primary view */}
                    { this.props.children }

                    <footer className="app-footer">
                      {/* TODO? */}
                    </footer>
                  </div>

                {/* User-customizable component showing system events */}
                <ContextBar />
              </div>
            }
          </Motion>

          {/* Hidden, user-callable developer tools */}
          <DebugTools />

          {/* Main app code */}
          <script type="text/javascript" src="/js/app.js"></script>
        </body>
      </html>
    );
  }
}


// REDUX
function mapStateToProps ( state ) {
  return { showSID: state.auth.showSID };
}


export default connect( mapStateToProps )( App );
