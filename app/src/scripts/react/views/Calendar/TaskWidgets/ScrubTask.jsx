// Scrub Task
// ==========
// Draggable widget to place on the Calendar in order to schedule a new
// recurring scrub task for a ZFS pool.

"use strict";

import React from "react";
import { Alert } from "react-bootstrap";

const ScrubTask = React.createClass(
  { propTypes: { volumeName: React.PropTypes.string
               , chooseActiveTask: React.PropTypes.func
               , handleTaskRemove: React.PropTypes.func
               }

  , getDefaultProps () { return { volumeName: null }; }

  , render () {
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
        <span>ZFS Scrub</span>
        <p>{ this.props.volumeName }</p>
        { deleteButton }
      </Alert>
    );
  }
});

export default ScrubTask;
