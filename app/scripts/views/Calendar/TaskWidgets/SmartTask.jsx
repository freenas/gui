// SMART Task
// ==========
// Draggable widget to place on the Calendar in order to schedule a new
// recurring S.M.A.R.T. test on a disk.

"use strict";

import React from "react";
import { Alert } from "react-bootstrap";

export default class SmartTask extends React.Component {

  constructor ( props ) {
    super( props );
    this.displayName = SmartTask;
  }

  render () {

    var taskTarget = "";
    if ( this.props.disks ) {
      if ( this.props.disks.length === 1 ) {
      taskTarget = this.props.disks[0].path;
      } else if ( this.props.disks.length > 1 ) {
        taskTarget = "Multiple Disks";
      }
    }

    var taskTitle = this.props.testType
                  ? "S.M.A.R.T. Test - " + this.props.testType
                  : "S.M.A.R.T. Test"


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
        <p>{ taskTarget }</p>
        { deleteButton }
      </Alert>
    );
  }
};

SmartTask.propTypes = { disks: React.PropTypes.array
                      , testType: React.PropTypes.string
                      , chooseActiveTask: React.PropTypes.func
                      , handleTaskRemove: React.PropTypes.func
                      };

SmartTask.defaultProps = { disks: []
                         , testType: null
                         };
