// SESSION INTERRUPT DIALOG - CONTAINER
// ====================================

"use strict";

import { Component } from "react";
import { connect } from "react-redux";

import * as actions from "../actions/auth";
import SessionInterruptDialog from "../views/App/SessionInterruptDialog";


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
