// Dashboard
// =========
// Default view for FreeNAS, shows overview of system and other general
// information.

"use strict";

import _ from "lodash";
import React from "react";

import freeNASUtil from "../../utility/freeNASUtil";

// import MemoryStats from "./Dashboard/MemoryStats";
import CpuStats from "./Dashboard/CpuStats";
import SystemInfo from "./Dashboard/SystemInfo";
// import SystemLoadStats from "./Dashboard/SystemLoadStats";
// import NetworkActivity from "./Dashboard/NetworkActivity";
// import DiskUsage from "./Dashboard/DiskUsage";


const widgetSettings =
  { SystemInfo:
    { size: "m-rect" }
  , MemoryStats:
    { size: "m-rect" }
  , CpuStats:
    { size: "m-rect"
    , statdResources:
      [ { variable: "system"
        , dataSource: "localhost.aggregation-cpu-sum.cpu-system.value.pulse"
        , name: "System"
        , color: "#9ecc3c"
        }
      , { variable: "user"
        , dataSource: "localhost.aggregation-cpu-sum.cpu-user.value.pulse"
        , name: "User"
        , color: "#77c5d5"
        }
      , { variable: "nice"
        , dataSource: "localhost.aggregation-cpu-sum.cpu-nice.value.pulse"
        , name: "Nice"
        , color: "#ffdb1a"
        }
      , { variable: "idle"
        , dataSource: "localhost.aggregation-cpu-sum.cpu-idle.value.pulse"
        , name: "Idle"
        , color: "#ed8b00"
        }
      , { variable: "interrupt"
        , dataSource: "localhost.aggregation-cpu-sum.cpu-interrupt.value.pulse"
        , name: "Interrupt"
        , color: "#cc3c3c"
        }
      ]
    , chartTypes:
      [ { type: "line"
        , primary: true
        //, primary: this.primaryChart( "line" )
        , y: function ( d ) {
           return ( round( d[1], 0.01 ) ); }
        }
      , { type: "pie"
        //, primary: this.primaryChart( "pie" )
        }
      ]
    }
  , SystemLoadStats:
    { size: "m-rect" }
  /*, NetworkActivity:
    { size: "l-rect"
    }
  , DiskUsage:
    { size: "l-rect"
    }*/
  };

const Dashboard = React.createClass(

  { render: function () {
    return (
      <div className = "widget-wrapper" >
        <SystemInfo
          stacked = "true"
          title = "System Info"
          { ...widgetSettings.SystemInfo } />

       {/*<MemoryStats
            title = "Memory Value"
            size  = { widgetSettings.MemoryStats.size }
            id          = { widgetSettings.MemoryStats.id }  />

        <CpuStats
          primary = "pie"
          title = "CPU utilization"
          { ...widgetSettings.CpuStats } />

          <SystemLoadStats
            primary   = "stacked"
            title     = "System Load"
            size      = { widgetSettings.SystemLoadStats.size }
            id          = { widgetSettings.SystemLoadStats.id }  />

        <NetworkActivity
            title = "Network Usage"
            size  = { widgetSettings.NetworkActivity.size }
            graphType = "line"
            id          = { widgetSettings.NetworkActivity.id }  />

          <DiskUsage
            title = "Disk Usage"
            size  = { widgetSettings.DiskUsage.size }
            graphType = "line"
            id          = { widgetSettings.DiskUsage.id }  />*/}
        </div>
    );
  }

});

export default Dashboard;
