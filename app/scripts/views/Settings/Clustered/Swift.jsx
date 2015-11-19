// Swift Configuration
// ===================

"use strict";

import React from "react";
import { Button, ButtonToolbar, Input, Panel } from "react-bootstrap";

import ToggleSwitch from "../../../components/ToggleSwitch";

const Swift = ( props ) => {

  const swift_hash_path_prefixValue = typeof props.swiftForm.swift_hash_path_prefix !== "undefined"
                                    ? props.swiftForm.swift_hash_path_prefix
                                    : props.swiftServerState.swift_hash_path_prefix;
  const swift_hash_path_suffixValue = typeof props.swiftForm.swift_hash_path_suffix !== "undefined"
                                    ? props.swiftForm.swift_hash_path_suffix
                                    : props.swiftServerState.swift_hash_path_suffix;


  const toggleService = (
    <div className = "pull-right" >
      <ToggleSwitch
        toggled = { props.swiftServerState.enable }
        onChange = { props.toggleSwiftTaskRequest }
      />
    </div>
  );

  const swift_hash_path_prefix = (
    <Input
      type = "text"
      label = "swift_hash_path_prefix"
      value = { swift_hash_path_prefixValue }
      onChange = { ( e ) => props.updateSwiftForm( "swift_hash_path_prefix"
                                                 , e.target.value
                                                 )
                 }
    />
  );

  const swift_hash_path_suffix = (
    <Input
      type = "text"
      label = "swift_hash_path_suffix"
      value = { swift_hash_path_suffixValue }
      onChange = { ( e ) => props.updateSwiftForm( "swift_hash_path_suffix"
                                                 , e.target.value
                                                 )
                 }
    />
  );

  const formControlButtons = (
    <ButtonToolbar className = "pull-right">
      <Button
        bsStyle = "default"
        onClick = { props.resetSwiftForm }
        disabled = { Object.keys( props.swiftForm ).length === 0 }
      >
        { "Reset" }
      </Button>
      <Button
        bsStyle = "primary"
        onClick = { props.configureSwiftTaskRequest }
        disabled = { Object.keys( props.swiftForm ).length === 0 }
      >
        { "Apply" }
      </Button>
    </ButtonToolbar>
  );

  return (
    <Panel>
      <h4>{ "Swift" }</h4>
      { toggleService }
      <form className = "settings-config-form">
        { swift_hash_path_prefix }
        { swift_hash_path_suffix }
        { formControlButtons }
      </form>
    </Panel>
  );

};

Swift.propTypes =
  { swiftServerState: React.PropTypes.shape(
    { enable: React.PropTypes.bool
    , swift_hash_path_prefix: React.PropTypes.string
    , swift_hash_path_suffix: React.PropTypes.string
    }
  )
  , swiftForm: React.PropTypes.shape(
    { swift_hash_path_prefix: React.PropTypes.string
    , swift_hash_path_suffix: React.PropTypes.string}
  )
  , updateSwiftForm: React.PropTypes.func.isRequired
  , resetSwiftForm: React.PropTypes.func.isRequired
  , configureSwiftTaskRequest: React.PropTypes.func.isRequired
  , toggleSwiftTaskRequest: React.PropTypes.func.isRequired
  };

export default Swift;
