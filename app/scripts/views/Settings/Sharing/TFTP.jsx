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

    const toggleService = (
      <div className = "pull-right" >
        <ToggleSwitch
          toggled = { true }
        />
      </div>
    );

    // This should be a filesystem selection component
    /*const path = (
      <Input
        type =
        label = Directory
        value = { this.props.path }
      />
    );*/

    const username = (
      <Input
        type = "select"
        label = "username"
        value = { this.props.username }
      />
    );

    const allow_new_files = (
      <Input
        type = "checkbox"
        label = "Allow New Files"
        checked = { this.props.allow_new_files }
      />
    );

    // This should be a permissions widget
    /* const umask = (
      <Input
        type = "text"
        label = "Default File Permissions"
        value = { this.props.umask }
      />
    );*/

    const port = (
      <Input
        type = "text"
        label = "Port"
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
        <h4>TFTP</h4>
        { toggleService }
        <form className = "settings-config-form">
          { /*path*/ }
          { username }
          { allow_new_files }
          { /*umask*/ }
          { port }
          { formControlButtons }
        </form>
      </Panel>
    );
  }
};

TFTP.propTypes = { username: React.PropTypes.string
                 , allow_new_files: React.PropTypes.bool
                 , umask: React.PropTypes.string
                 , path: React.PropTypes.string
                 , port: React.PropTypes.number
                 };
