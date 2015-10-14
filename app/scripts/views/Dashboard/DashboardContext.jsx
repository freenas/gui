// Dashboard Widgets Context
// =========================
// Sidebar with additional system stats widgets.

"use strict";

import React from "react";

import MemoryMeter from "../../components/Widgets/MemoryMeter";
import CPUMeter from "../../components/Widgets/CPUMeter";
import NewsFeed from "./NewsFeed";

const DashboardContext = React.createClass(
  { render () {
    return (
      <div className="context-dashboard">
        <NewsFeed/>
        <CPUMeter/>
        <MemoryMeter/>
      </div>
    );
  }
});

export default DashboardContext;
