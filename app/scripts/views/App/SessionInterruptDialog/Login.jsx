// SID - LOGIN TYPE
// ================
// Use for any SID which requires user login

"use strict";

import React from "react";
import { Input } from "react-bootstrap";

const Login = ({ username, password, onUsernameChange, onPasswordChange }) => (
  <form>
    <Input
      type        = "text"
      placeholder = "Username"
      value       = { username }
      onChange    = { (e) => onUsernameChange( e.target.value ) }
    />

    <Input
      type        = "password"
      placeholder = "Password"
      value       = { password }
      onChange    = { (e) => onPasswordChange( e.target.value ) }
    />
  </form>
);

Login.propTypes =
  { username: React.PropTypes.string
  , password: React.PropTypes.string
  , onUsernameChange: React.PropTypes.func.isRequired
  , onPasswordChange: React.PropTypes.func.isRequired
  }

export default Login;
