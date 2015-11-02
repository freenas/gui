// AFP Configuration
// =================

"use strict";

import React from "react";
import { Button, ButtonToolbar, Input, Panel } from "react-bootstrap";

import ToggleSwitch from "../../../components/ToggleSwitch";

const AFP = ( props ) => {

  const connectionsLimitValue = typeof props.afpForm.connections_limit !== "undefined"
                              ? props.afpForm.connections_limit
                              : props.afpServerState.connections_limit;
  const guestUserValue = typeof props.afpForm.guest_user !== "undefined"
                       ? props.afpForm.guest_user
                       : props.afpServerState.guest_user;
  const dbpathValue = typeof props.afpForm.dbpath !== "undefined"
                    ? props.afpForm.dbpath
                    : props.afpServerState.dbpath;
  const homedirPathValue = typeof props.afpForm.homedir_path !== "undefined"
                         ? props.afpForm.homedir_path
                         : props.afpServerState.homedir_path;
  const bindAddressesValue = typeof props.afpForm.bind_addresses !== "undefined"
                           ? props.afpForm.bind_addresses
                           : props.afpServerState.bind_addresses;
  const homedirNameValue = typeof props.afpForm.homedir_name !== "undefined"
                         ? props.afpForm.homedir_name
                         : props.afpServerState.homedir_name;
  const homedirEnableValue = typeof props.afpForm.homedir_enable !== "undefined"
                           ? props.afpForm.homedir_enable
                           : props.afpServerState.homedir_enable;
  const guestEnableValue = typeof props.afpForm.guest_enable !== "undefined"
                          ? props.afpForm.guest_enable
                          : props.afpServerState.guest_enable;

  const toggleService = (
    <div className = "pull-right" >
      <ToggleSwitch
        toggled = { props.afpServerState.enable }
        onChange = { props.toggleAFPTaskRequest }
      />
    </div>
  );

  const connectionsLimit = (
    <Input
      type = "checkbox"
      label = "Allow Guest Access"
      value = { connectionsLimitValue }
      onChange = { ( e ) => props.updateAFPForm( "connections_limit"
                                               , e.target.value
                                               )
                 }
    />
  );

  const guestUser = (
    <Input
      type = "select"
      label = "Guest User Account"
      value = { guestUserValue }
      onChange = { ( e ) => props.updateAFPForm( "guest_user"
                                               , e.target.value
                                               )
                 }
    />
  );

  const guestEnable = (
    <Input
      type = "checkbox"
      label = "Enable Home Directories"
      checked = { guestEnableValue }
      onChange = { ( e ) => props.updateAFPForm( "guest_enable"
                                               , e.target.checked
                                               )
                 }
    />
  );

  const enableHomedir = (
    <Input
      type = "checkbox"
      label = "Enable home Directories"
      checked = { homedirEnableValue }
      onChange = { ( e ) => props.updateAFPForm( "homedir_enable"
                                               , e.target.checked
                                               )
                 }
    />
  );

  const homedirName = (
    <Input
      type = "string"
      label = "Home Share Name"
      value = { homedirNameValue }
      onChange = { ( e ) => props.updateAFPForm( "homedir_name"
                                               , e.target.value
                                               )
                 }
    />
  );

  // These could use a filesystem selection component
  const homedirPath = (
    <Input
      type = "text"
      label = "Home Directory Root"
      value = { homedirPathValue }
      onChange = { ( e ) => props.updateAFPForm( "homedir_path"
                                               , e.target.value
                                               )
                 }
    />
  );

  const databasePath = (
    <Input
      type = "text"
      label = "Database Path"
      value = { dbpathValue }
      onChange = { ( e ) => props.updateAFPForm( "dbpath"
                                               , e.target.value
                                               )
                 }
    />
  );

  const bindAddresses = (
    <Input
      type = "select"
      label = "Bind IP Addresses"
      value = { bindAddressesValue }
      onChange = { ( e ) => props.updateAFPForm( "bind_addresses"
                                               , e.target.value
                                               )
                 }
      multiple
      disabled
    >
      { /* available IP addresses */ }
    </Input>
  );

  const formControlButtons = (
    <ButtonToolbar className = "pull-right">
      <Button
        bsStyle = "default"
        onClick = { props.resetAFPForm }
        disabled = { Object.keys( props.afpForm ).length === 0 }
      >
        { "Reset" }
      </Button>
      <Button
        bsStyle = "primary"
        onClick = { props.configureAFPTaskRequest }
        disabled = { Object.keys( props.afpForm ).length === 0 }
      >
        { "Apply" }
      </Button>
    </ButtonToolbar>
  );

  return (
    <Panel>
      <h4>{ "AFP" }</h4>
      { toggleService }
      <form className = "settings-config-form">
        { connectionsLimit }
        { guestUser }
        { guestEnable }
        { enableHomedir }
        { homedirName }
        { homedirPath }
        { databasePath }
        { bindAddresses }
        { formControlButtons }
      </form>
    </Panel>
  );
};

AFP.propTypes =
  { afpServerState: React.PropTypes.shape(
    { enable: React.PropTypes.bool
    , connections_limit: React.PropTypes.oneOfType(
      [ React.PropTypes.number
      , React.PropTypes.string
      ]
    )
    , guest_user: React.PropTypes.string
    , dbpath: React.PropTypes.string
    , homedir_path: React.PropTypes.string
    , bind_addresses: React.PropTypes.arrayOf( React.PropTypes.string )
    , homedir_name: React.PropTypes.string
    , homedir_enable: React.PropTypes.bool
    , guest_enable: React.PropTypes.bool
    }
  )
  , afpForm: React.PropTypes.shape(
    { connections_limit: React.PropTypes.oneOfType(
      [ React.PropTypes.number
      , React.PropTypes.string
      ]
    )
    , guest_user: React.PropTypes.string
    , dbpath: React.PropTypes.string
    , homedir_path: React.PropTypes.string
    , bind_addresses: React.PropTypes.arrayOf( React.PropTypes.string )
    , homedir_name: React.PropTypes.string
    , homedir_enable: React.PropTypes.bool
    , guest_enable: React.PropTypes.bool
    }
  )
  , updateAFPForm: React.PropTypes.func.isRequired
  , resetAFPForm: React.PropTypes.func.isRequired
  , configureAFPTaskRequest: React.PropTypes.func.isRequired
  , toggleAFPTaskRequest: React.PropTypes.func.isRequired
};

export default AFP;
