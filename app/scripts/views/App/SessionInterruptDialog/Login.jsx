// SID - LOGIN TYPE
// ================
// Use for any SID which requires user login

"use strict";

import React from "react";
import { Motion, spring } from "react-motion";
import { Input } from "react-bootstrap";

import { ghost } from "../../../utility/motions";

const Login = ( props ) => (
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
          onChange    = { (e) => props.onUsernameChange( e.target.value ) }
        />

        <Input
          type        = "password"
          placeholder = "Password"
          className   = "form-overlay"
          value       = { props.password }
          onChange    = { (e) => props.onPasswordChange( e.target.value ) }
        />
      </form>
    }
  </Motion>
);

Login.propTypes =
  { visible: React.PropTypes.bool.isRequired
  , username: React.PropTypes.string
  , password: React.PropTypes.string
  , onUsernameChange: React.PropTypes.func.isRequired
  , onPasswordChange: React.PropTypes.func.isRequired
  }

export default Login;
