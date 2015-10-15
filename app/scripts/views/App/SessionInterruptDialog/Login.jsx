// SID - LOGIN TYPE
// ================
// Use for any SID which requires user login

"use strict";

import React from "react";
import { Input } from "react-bootstrap";

export default ({ username, password, onUsernameChange, onPasswordChange }) => (
  <div className="overlay-window">
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
  </div>
);
