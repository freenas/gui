// VOLUME TASK
// ===========
// Show ongoing progress for a Volume-related task.

"use strict";

import React from "react";

const ACTIVE_STATES = new Set([ "CREATED", "WAITING", "EXECUTING" ]);

export default class VolumeTask extends React.Component {
  render () {
    let activeTask = Array.find( this.props.tasks, ( task ) => {
      return ACTIVE_STATES.has( task.state.toUpperCase() );
    });

    if ( activeTask ) {
      return (
        <h1>{"SOMETHING IS HAPPENING TO A POOL OMG"}</h1>
      );
    } else {
      return null;
    }
  }
}

VolumeTask.propTypes =
  { tasks: React.PropTypes.array
  };
