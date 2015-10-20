// Scrub Task
// ==========
// Draggable widget to place on the Calendar in order to schedule a new
// recurring scrub task for a ZFS pool.

"use strict";

import React from "react";
import { Alert } from "react-bootstrap";

export default class ScrubTask extends React.Component {

  constructor ( props ) {
    super( props );
    this.displayName = ScrubTask;
  }

  render () {
    var taskTitle = this.props.taskID
                  ? "ZFS Scrub" + " - " + this.props.taskID
                  : "ZFS Scrub";

    var deleteButton = null;
    if ( this.props.handleTaskRemove ) {
      deleteButton =
        <span
          className = "task-remove"
          onClick = { this.props.handleTaskRemove }
        />;
    }

    return (
      <Alert
        bsStyle = "info"
        bsSize = "small"
        onClick = { this.props.chooseActiveTask }>
        <span>{ taskTitle }</span>
        <p>{ this.props.volumeName }</p>
        { deleteButton }
      </Alert>
    );
  }
};

ScrubTask.propTypes = { volumeName: React.PropTypes.string
                      , chooseActiveTask: React.PropTypes.func
                      , handleTaskRemove: React.PropTypes.func
                      , taskID: React.PropTypes.string
                      };

ScrubTask.defaultProps = { volumeName: null };
