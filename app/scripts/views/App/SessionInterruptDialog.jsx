// SESSION INTERRUPT DIALOG - VIEW
// ===============================
// This dialog is shown for a variety of reasons, all of which having to do with
// the GUI entering a "disconnected" state. This dialog is visible when no
// WebSocket connection exists, and may indicate to the user that their session
// has expired.

"use strict";

import React from "react";
import { Input } from "react-bootstrap";

// STYLESHEET
if ( process.env.BROWSER ) require( "./PrimaryNavigation.less" );


export default class SessionInteruptDialog extends React.Component {

  render () {
    const { auth } = this.props;

    console.dir( this.props );

    return (
      <div className="overlay-dark" >
        <div className="overlay-window">
          <Input
            type        = "text"
            placeholder = "Username"
            value       = { auth.username }
            onChange    = { (e) => this.props.onUsernameChange( e.target.value ) }
          />

          <Input
            type        = "password"
            placeholder = "Password"
            value       = { auth.password }
            onChange    = { (e) => this.props.onPasswordChange( e.target.value ) }
          />
        </div>
      </div>
    );
  }
}
