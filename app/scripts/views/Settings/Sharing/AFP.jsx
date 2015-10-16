// AFP Configuration
// =================

"use strict";

import React from "react";
import { Button, ButtonToolbar, Input, Panel } from "react-bootstrap";

import ToggleSwitch from "../../../components/ToggleSwitch";

export default class AFP extends React.Component {
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

    const guestAccess = (
      <Input
        type = "checkbox"
        label = "Allow Guest Access"
        value = { this.props.connections_limit }
      />
    );

    const guestUser = (
      <Input
        type = "select"
        label = "Guest User Account"
        value = { this.props.guest_user }
      />
    );

    const enableHomedir = (
      <Input
        type = "checkbox"
        label = "Enable home Directories"
        checked = { this.props.homedir_enable }
      />
    );

    const homedirName = (
      <Input
        type = "string"
        label = "Home Share Name"
        value = { this.props.homedir_name }
      />
    );

    // These could use a filesystem selection component
/*  const homedirPath = (
      <Input
        type =
        label = "Home Directory Root"
        value = { this.props.homedir_path }
      />
    );

    const databasePath = (
      <Input
        type =
        label = "Database Path"
        value = { this.props.dbpath }
      />
    );
*/

    const bindAddresses = (
      <Input
        type = "select"
        label = "Bind IP Addresses"
        value = { this.props.bind_addresses }
        multiple
      >
        { /* available IP addresses */ }
      </Input>
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
        <h4>AFP</h4>
        { toggleService }
        <form className = "settings-config-form">
          { guestAccess /* Basic Field*/ }
          { guestUser /* Basic Field*/ }
          { enableHomedir /* Basic Field*/ }
          { homedirName /* Basic Field*/ }
          { /*homedirPath*/ /* Basic Field*/ }
          { /*databasePath*/ }
          { bindAddresses }
          { formControlButtons }
        </form>
      </Panel>
    );
  }
};

AFP.propTypes = { connections_limit: React.PropTypes.number
                , guest_user: React.PropTypes.string
                , dbpath: React.PropTypes.string
                , homedir_path: React.PropTypes.string
                , bind_addresses: React.PropTypes.arrayOf( React.PropTypes.string )
                , homedir_name: React.PropTypes.string
                , homedir_enable: React.PropTypes.bool
                , guest_enable: React.PropTypes.bool
                };
