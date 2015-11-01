// IPFS Configuration
// ==================

"use strict";

import React from "react";
import { Button, ButtonToolbar, Input, Panel } from "react-bootstrap";

import ToggleSwitch from "../../../components/ToggleSwitch";

const IPFS = ( props ) => {

  const pathValue = typeof props.ipfsForm.path !== "undefined"
                  ? props.ipfsForm.path
                  : props.ipfsServerState.path;


  const toggleService = (
    <div className = "pull-right" >
      <ToggleSwitch
        toggled = { props.ipfsServerState.enable }
        onChange = { props.toggleIPFSTaskRequest }
      />
    </div>
  );

  const path = (
    <Input
      type = "text"
      label = "path"
      value = { pathValue }
      onChange = { ( e ) => props.updateIPFSForm( "path"
                                                , e.target.value
                                                )
                 }
    />
  );

  const formControlButtons = (
    <ButtonToolbar className = "pull-right">
      <Button
        bsStyle = "default"
        onClick = { props.resetIPFSForm }
        disabled = { Object.keys( props.ipfsForm ).length === 0 }
      >
        { "Reset" }
      </Button>
      <Button
        bsStyle = "primary"
        onClick = { props.configureIPFSTaskRequest }
        disabled = { Object.keys( props.ipfsForm ).length === 0 }
      >
        { "Apply" }
      </Button>
    </ButtonToolbar>
  );

  return (
    <Panel>
      <h4>{ "IPFS" }</h4>
      { toggleService }
      <form className = "settings-config-form">
        { path }
        { formControlButtons }
      </form>
    </Panel>
  );

};

IPFS.propTypes = { ipfsServerState: React.PropTypes.shape(
                  { enable: React.PropTypes.bool
                  , path: React.PropTypes.string
                  }
                  )
                , ipfsForm: React.PropTypes.shape(
                  { path: React.PropTypes.string }
                  )
                , updateIPFSForm: React.PropTypes.func.isRequired
                , resetIPFSForm: React.PropTypes.func.isRequired
                , configureIPFSTaskRequest: React.PropTypes.func.isRequired
                , toggleIPFSTaskRequest: React.PropTypes.func.isRequired
                };

export default IPFS;
