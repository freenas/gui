// Dashboard
// =========
// Default view for FreeNAS, shows overview of system and other general
// information.

"use strict";

import React from "react";

import CPU from "../components/Widgets/CPU";
import Network from "../components/Widgets/Network";
import Memory from "../components/Widgets/Memory";

const Dashboard = React.createClass(
  { render () {
      return (
        <main className="dashboard">
          <div className="dashboard-widgets">

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
