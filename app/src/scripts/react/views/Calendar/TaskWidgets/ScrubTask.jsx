// Scrub Task
// ==========
// Draggable widget to place on the Calendar in order to schedule a new
// recurring scrub task for a ZFS pool.

"use strict";

import React from "react";

const ScrubTask = React.createClass(
  { propTypes: { volumeName: React.PropTypes.string
               , toggleTask: React.PropTypes.func
               }

  , getDefaultProps () { return { volumeName: null } }

  , render () {
    return (
      <div onDoubleClick = { this.props.toggleTask }>
        <h4>ZFS Scrub</h4>
        <h5>{ this.props.volumeName }</h5>
      </div>
    );
  }
});

export default ScrubTask;
