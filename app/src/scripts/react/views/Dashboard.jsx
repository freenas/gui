// Dashboard
// =========
// Default view for FreeNAS, shows overview of system and other general
// information.

"use strict";

import React from "react";

import SystemInfo from "../components/Widgets/SystemInfo";
import CPU from "../components/Widgets/CPU";
import Network from "../components/Widgets/Network";
import Memory from "../components/Widgets/Memory";
import DashboardContext from "./Dashboard/DashboardContext";

const Dashboard = React.createClass(
  { render () {
      return (
        <main className="full dashboard">
          <div className="dashboard-widgets">

            <SystemInfo />

            <CPU />

            <Network />

            <Memory />
          </div>
        </main>
      );
    }
  }
);

export default Dashboard;
