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
      <DropTarget>
        <DragTarget>
          <ScrubTask/>
        </DragTarget>
      </DropTarget>
    );
  }
});

export default CalendarTaskContext;
