// Gluster Configuration
// =====================

"use strict";

import React from "react";
import { Button, ButtonToolbar, Input, Panel } from "react-bootstrap";

import ToggleSwitch from "../../../components/ToggleSwitch";

const Gluster = ( props ) => {

  const working_directoryValue = typeof props.glusterForm.working_directory !== "undefined"
                               ? props.glusterForm.working_directory
                               : props.glusterServerState.working_directory;


  const toggleService = (
    <div className = "pull-right" >
      <ToggleSwitch
        toggled = { props.glusterServerState.enable }
        onChange = { props.toggleGlusterTaskRequest }
      />
    </div>
  );

  const working_directory = (
    <Input
      type = "text"
      label = "working_directory"
      value = { working_directoryValue }
      onChange = { ( e ) => props.updateGlusterForm( "working_directory"
                                                   , e.target.value
                                                   )
                 }
    />
  );

  const formControlButtons = (
    <ButtonToolbar className = "pull-right">
      <Button
        bsStyle = "default"
        onClick = { props.resetGlusterForm }
        disabled = { Object.keys( props.glusterForm ).length === 0 }
      >
        { "Reset" }
      </Button>
      <Button
        bsStyle = "primary"
        onClick = { props.configureGlusterTaskRequest }
        disabled = { Object.keys( props.glusterForm ).length === 0 }
      >
        { "Apply" }
      </Button>
    </ButtonToolbar>
  );

  return (
    <Panel>
      <h4>{ "Gluster" }</h4>
      { toggleService }
      <form className = "settings-config-form">
        { working_directory }
        { formControlButtons }
      </form>
    </Panel>
  );

};

Gluster.propTypes =
  { glusterServerState: React.PropTypes.shape(
    { enable: React.PropTypes.bool
    , working_directory: React.PropTypes.string
    }
  )
  , glusterForm: React.PropTypes.shape(
    { working_directory: React.PropTypes.string }
  )
  , updateGlusterForm: React.PropTypes.func.isRequired
  , resetGlusterForm: React.PropTypes.func.isRequired
  , configureGlusterTaskRequest: React.PropTypes.func.isRequired
  , toggleGlusterTaskRequest: React.PropTypes.func.isRequired
  };

export default Gluster;
