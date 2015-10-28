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
    const { auth, websocket, message, visible, ...handlers } = this.props;


    return (
      <Motion
        defaultStyle = {{ mainOpacity: 1 }}
        style = {{ mainOpacity: spring( visible ? 1 : 0 ) }}
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

              <h3>{ message }</h3>

              <Login
                visible = { visible === "LOGIN" }
                username = { auth.username }
                password = { auth.password }
                onUsernameChange = { handlers.onUsernameChange }
                onPasswordChange = { handlers.onPasswordChange }
                onLoginSubmit = { handlers.onLoginSubmit }
              />

              <Spinner visible={ visible === "SPINNER" } />
            </div>
          </div>
        }
      </Motion>
    );
  }
}


// REDUX
function mapStateToProps ( state ) {
  const { auth, websocket } = state;

  let message = "";
  let visible = false;

  if ( websocket.SIDShow ) {
    visible = "SPINNER";
    message = websocket.SIDMessage;
  } else if ( auth.SIDShow ) {
    message = auth.SIDMessage;
    if ( auth.isWaiting ) {
      visible = "SPINNER";
    } else {
      visible = "LOGIN";
    }
  }

  return ({ auth, websocket, message, visible });
}

function mapDispatchToProps ( dispatch ) {
  return (
    { onUsernameChange: ( username ) => dispatch( actions.updateUsername( username ) )
    , onPasswordChange: ( password ) => dispatch( actions.updatePassword( password ) )
    , onLoginSubmit: () => dispatch( actions.authRPC() )
    }
  );
}

export default connect( mapStateToProps, mapDispatchToProps )( SessionInterruptDialog );
