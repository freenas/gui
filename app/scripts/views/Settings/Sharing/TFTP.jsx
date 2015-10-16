// TFTP Configuration
// ==================

"use strict";

import React from "react";
import { Button, ButtonToolbar, Input, Panel } from "react-bootstrap";

import ToggleSwitch from "../../../components/ToggleSwitch";

export default class TFTP extends React.Component {
  constructor ( props ) {
    super( props );
  }

  render () {
    return (
      <Panel>
        <h4>TFTP</h4>
      </Panel>
    );
  }
};
