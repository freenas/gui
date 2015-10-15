// SID - SPINNER TYPE
// ================
// Show a spinner and a message when something is going on

"use strict";

import React from "react";

import Throbber from "../../../components/Throbber";

const Spinner = ({ message }) => (
  <div className="overlay-window">
    <h3>{ message }</h3>
    <Throbber
      bsStyle = "primary"
      size = { 60 }
    />
  </div>
);

Spinner.propTypes =
  { message: React.PropTypes.string
  };

export default Spinner;
