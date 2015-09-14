// Dashboard Widgets Context
// =========================
// Sidebar with additional system stats widgets.

"use strict";

import React from "react";

import MemoryMeter from "../../components/Widgets/MemoryMeter";

const DashboardContext = React.createClass(
  { render () {
    return (
      <div>
        <MemoryMeter/>
      </div>
    );
  }
});

export default DashboardContext;
