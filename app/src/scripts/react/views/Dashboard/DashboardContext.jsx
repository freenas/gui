// Dashboard Widgets Context
// =========================
// Sidebar with additional system stats widgets.

"use strict";

import React from "react";

import MemoryMeter from "../../components/Widgets/MemoryMeter";
import CPUMeter from "../../components/Widgets/CPUMeter";

const DashboardContext = React.createClass(
  { render () {
    return (
      <div>
        <MemoryMeter/>
        <CPUMeter/>
      </div>
    );
  }
});

export default DashboardContext;
