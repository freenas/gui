// SESSION INTERRUPT DIALOG - VIEW
// ===============================
// This dialog is shown for a variety of reasons, all of which having to do with
// the GUI entering a "disconnected" state. This dialog is visible when no
// WebSocket connection exists, and may indicate to the user that their session
// has expired.

"use strict";

import React from "react";
import { connect } from "react-redux";
import { Motion, spring } from "react-motion";

import * as actions from "../../actions/auth";
import Throbber from "../../components/Throbber";
import Login from "./SessionInterruptDialog/Login";
import Spinner from "./SessionInterruptDialog/Spinner";

// STYLESHEET
if ( process.env.BROWSER ) require( "./SessionInterruptDialog.less" );


// REACT
class SessionInterruptDialog extends React.Component {
  render () {
    // TODO: The logic for this will need to be more complicated at some point
    const VISIBLE = this.props.isFetching
                  ? "SPINNER"
                  : "LOGIN";
    return (
      <Motion
        defaultStyle = {{ mainOpacity: 0 }}
        style = {{ mainOpacity: spring( this.props.showSID ? 1 : 0 ) }}
      >
        { ({ mainOpacity }) =>
          <div
            className = "sid"
            style = {
              { opacity: mainOpacity
              , display: mainOpacity === 0
                       ? "none"
                       : ""
              }
            }
          >
            <div className="sid-content">

              <div className="logo-wrapper">
                <img className="logo-image" src="/images/freenas-icon.png" />
                <img className="logo-wordmark" src="/images/freenas-logotype.png" />
                <img className="logo-x" src="/images/X.png" />
              </div>

              <h3>{ this.props.message }</h3>

              <Login
                visible = { VISIBLE === "LOGIN" }
                username = { this.props.username }
                password = { this.props.password }
                onUsernameChange = { this.props.onUsernameChange }
                onPasswordChange = { this.props.onPasswordChange }
              />

              <Spinner visible={ VISIBLE === "SPINNER" } />
            </div>
          </div>
        }
      </Motion>
    );
  }
}


// REDUX

function mapStateToProps ( state ) {
  return (
    { ...state.auth }
  );
}

function mapDispatchToProps ( dispatch ) {
  return (
    { onUsernameChange: ( username ) => dispatch( actions.updateUsername( username ) )
    , onPasswordChange: ( password ) => dispatch( actions.updatePassword( password ) )
    }
  );
}

export default connect( mapStateToProps, mapDispatchToProps )( SessionInterruptDialog );
