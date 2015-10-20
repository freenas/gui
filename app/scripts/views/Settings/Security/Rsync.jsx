// rsync Configuration
// ===================

"use strict";

import React from "react";
import { Button, ButtonToolbar, Input, Panel } from "react-bootstrap";

import ToggleSwitch from "../../../components/ToggleSwitch";

export default class Rsync extends React.Component {
  constructor ( props ) {
    super ( props );
  }

  render () {

    const toggleService = (
      <div className = "pull-right" >
        <ToggleSwitch
          toggled = { true }
        />
      </div>
    );

    const tcpPort = (
      <Input
        type = "text"
        label = "TCP Port"
        value = { this.props.port }
      />
    );
    const formControlButtons = (
      <ButtonToolbar className = "pull-right">
        <Button
          bsStyle = "default"
        >
          { "Reset" }
        </Button>
        <Button
          bsStyle = "primary"
        >
          { "Apply" }
        </Button>
      </ButtonToolbar>
    );

    return (
      <Panel>
        <h4>rsync</h4>
        { toggleService }
        <form className = "settings-config-form">
          { tcpPort }
          { formControlButtons }
        </form>
      </Panel>
    );
  }
};

Rsync.propTypes = { port: React.PropTypes.number };
