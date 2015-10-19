// SID - LOGIN TYPE
// ================
// Use for any SID which requires user login

"use strict";

import React from "react";
import { Motion, spring } from "react-motion";
import { Button, Input } from "react-bootstrap";

import { ghost } from "../../../utility/motions";

const Login = ( props ) => {

  function handleInputKeyDown ( key ) {
    if ( key === "Enter" ) props.onLoginSubmit();
  }

  return (
    <Motion
      defaultStyle = { props.visible ? ghost.defaultIn : ghost.defaultOut }
      style = { props.visible ? ghost.in : ghost.out }
    >
      { ({ y, opacity }) =>
        <form
          style = {
            { transform: `translateY( ${ y }px )`
            , opacity
            , display: y === -100 ? "none" : ""
            }
          }
        >
          <Input
            type        = "text"
            placeholder = "Username"
            className   = "form-overlay"
            value       = { props.username }
            onKeyDown   = { (e) => handleInputKeyDown( e.key ) }
            onChange    = { (e) => props.onUsernameChange( e.target.value ) }
          />

          <Input
            type        = "password"
            placeholder = "Password"
            className   = "form-overlay"
            value       = { props.password }
            onKeyDown   = { (e) => handleInputKeyDown( e.key ) }
            onChange    = { (e) => props.onPasswordChange( e.target.value ) }
          />

          <Button
            block
            bsStyle  = "primary"
            disabled = { props.username.length < 1 || !props.visible }
            onClick  = { (e) => props.onLoginSubmit() }
          >
            {"Sign In"}
          </Button>
        </form>
      }
    </Motion>
  );
};

Login.propTypes =
  { visible: React.PropTypes.bool.isRequired
  , username: React.PropTypes.string
  , password: React.PropTypes.string
  , onUsernameChange: React.PropTypes.func.isRequired
  , onPasswordChange: React.PropTypes.func.isRequired
  , onLoginSubmit: React.PropTypes.func.isRequired
  }

export default Login;
