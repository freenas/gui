// SESSION INTERRUPT DIALOG - VIEW
// ===============================
// This dialog is shown for a variety of reasons, all of which having to do with
// the GUI entering a "disconnected" state. This dialog is visible when no
// WebSocket connection exists, and may indicate to the user that their session
// has expired.

"use strict";

import React from "react";
import { connect } from "react-redux";

import * as actions from "../../actions/auth";
import Spinner from "./SessionInterruptDialog/Spinner";
import Login from "./SessionInterruptDialog/Login";

// STYLESHEET
if ( process.env.BROWSER ) require( "./SessionInterruptDialog.less" );


// REACT
class SessionInterruptDialog extends React.Component {
  render () {
    const { auth } = this.props;

    return (
      <div className="overlay-dark sid" >
        <Spinner message = "Waiting for GUI to not suck..." />
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


// REDUX
function mapStateToProps ( state ) {
  console.log( state );
  return { auth: state.auth };
}

function mapDispatchToProps ( dispatch ) {
  return (
    { onUsernameChange: ( username ) => dispatch( actions.updateUsername( username ) )
    , onPasswordChange: ( password ) => dispatch( actions.updatePassword( password ) )
    }
  );
}

export default connect( mapStateToProps, mapDispatchToProps )( SessionInterruptDialog );
