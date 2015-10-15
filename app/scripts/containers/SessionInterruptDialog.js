// SESSION INTERRUPT DIALOG - CONTAINER
// ====================================

"use strict";

import { Component } from "react";
import { connect } from "react-redux";

import SessionInterruptDialog from "../views/App/SessionInterruptDialog";


function mapStateToProps ( state ) {
  console.log( state );
  return {
    value: state
  };
}

function mapDispatchToProps ( dispatch ) {
  return {}
}

export default connect( mapStateToProps, mapDispatchToProps )( SessionInterruptDialog );
