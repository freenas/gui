// SESSION INTERRUPT DIALOG - VIEW
// ===============================
// This dialog is shown for a variety of reasons, all of which having to do with
// the GUI entering a "disconnected" state. This dialog is visible when no
// WebSocket connection exists, and may indicate to the user that their session
// has expired.

"use strict";

import React from "react";
import Login from "./SessionInterruptDialog/Login";

// STYLESHEET
if ( process.env.BROWSER ) require( "./SessionInterruptDialog.less" );


export default class SessionInterruptDialog extends React.Component {

  render () {
    const { auth } = this.props;

    console.dir( this.props );

    return (
      <div className="overlay-dark" >
        <Login
          username = { auth.username }
          password = { auth.password }
          onUsernameChange = { this.props.onUsernameChange }
          onPasswordChange = { this.props.onPasswordChange }
        />
      </div>
    );
  }
}
