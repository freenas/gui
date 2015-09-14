// Calendar Tasks Palette
// ======================
// Contextual display for available tasks to be added to the Calendar.

"use strict";

import React from "react";

import DragTarget from "../../components/DragTarget";
import DropTarget from "../../components/DropTarget";

import ScrubTask from "./TaskWidgets/ScrubTask";

const CalendarTaskContext = React.createClass(
  { render() {
    return (
      <div className="context-content context-disks">
        <h5 className="context-section-header type-line">
          <span className="text">
            { "New System Tasks" }
          </span>
        </h5>
        <DropTarget
          namespace = "calendar">
          <DragTarget
            namespace = "calendar"
            payload = "scrub">
            <ScrubTask/>
          </DragTarget>
        </DropTarget>
      </div>
    );
  }
});

export default CalendarTaskContext;
