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
// TODO: Convert to Redux and reenable
// import DebugTools from "./App/DebugTools";
import Events from "./App/Events";
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
    if ( radius ) {
      return (
        // TODO: Explorer sucks and doesn't have this functionality. Needs a
        // nice looking workaround.
        { WebkitFilter: `blur( ${ radius }px )`
        , filter: `blur( ${ radius }px )`
        , willChange: ( radius !== 0 && radius !== 100
                      ? "-webkit-filter, filter"
                      : ""
                      )
        }
      );
    } else {
      return {};
    }
  }

  render () {
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
              defaultStyle = {{ blur: 100 }}
              style = {
                { blur: spring( this.props.shouldBlur ? 100 : 0 )
                }
              }
            >
              { ({ blur }) =>

                <div
                  className={ "app-content"
                            + ( blur !== 0 && blur !== 100
                              ? " force-hardware-accel"
                              : ""
                              )
                            }
                  style = { this.getBlurStyle( blur ) }
                >
                  {/* Primary navigation menu */}
                  <PrimaryNavigation />

                  <div className="app-view">
                    {/* Primary view */}
                    { this.props.children }

                    {/* Event notifications */}
                    <Events />

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
          {/* TODO: Convert to Redux and reenable */}
          {/* <DebugTools /> */}

          {/* Main app code */}
          <script type="text/javascript" src="/js/app.js"></script>
        </body>
      </html>
    );
  }
}


// REDUX
function mapStateToProps ( state ) {
  return { shouldBlur: state.auth.SIDShow || state.websocket.SIDShow };
}


export default connect( mapStateToProps )( App );
