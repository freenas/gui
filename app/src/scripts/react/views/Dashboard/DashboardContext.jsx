// Dashboard Widgets Context
// =========================
// Sidebar with additional system stats widgets.

"use strict";

import React from "react";

import MemoryMeter from "../../components/Widgets/MemoryMeter";
import CPUMeter from "../../components/Widgets/CPUMeter";
import TasksSidebar from "./TasksSidebar";

const DashboardContext = React.createClass(
  { render () {
    return (
      <div className="context-dashboard">
        <TasksSidebar/>
        <CPUMeter/>
        <MemoryMeter/>
      </div>
    );
  }
});

export default DashboardContext;
