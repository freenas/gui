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

// STYLESHEET
if ( process.env.BROWSER ) require( "./SessionInterruptDialog.less" );


// REACT
class SessionInterruptDialog extends React.Component {
  render () {
    return (
      <Motion
        defaultStyle = {{ mainOpacity: 0 }}
        style = {{ mainOpacity: spring( this.props.showSID ? 1 : 0 ) }}
      >
        { ({ mainOpacity }) =>
          <div
            className = "overlay-dark sid"
            style = {
              { opacity: mainOpacity
              , display: mainOpacity === 0
                       ? "none"
                       : ""
              }
            }
          >
            <div className="overlay-window">
              <h3>{ "Foo" }</h3>
              <Throbber
                size = { 60 }
              />
              <Login
                username = { this.props.username }
                password = { this.props.password }
                onUsernameChange = { this.props.onUsernameChange }
                onPasswordChange = { this.props.onPasswordChange }
              />
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
