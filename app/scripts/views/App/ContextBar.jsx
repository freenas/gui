// Context Bar
// ===============
// Part of the main webapp's window chrome. Positioned on the right side of the
// page, this bar shows user-customizable content including graphs, logged in
// users, and other widgets.

"use strict";

import React from "react";

import EventBus from "../../utility/EventBus";
import DashboardContext from "../Dashboard/DashboardContext";
import TopologyEditContext from "../Storage/contexts/TopologyEditContext";

// STYLESHEET
if ( process.env.BROWSER ) require( "./ContextBar.less" );


// REACT
const ContextBar = ( props ) => {
  function getActiveComponent() {
    if ( props.location ) {
      switch ( props.location.pathname ) {
        case "/storage":
          return <TopologyEditContext />;
      }
    }

    return <DashboardContext />;
  }

  return (
    <aside className="app-sidebar" >
      { getActiveComponent() }
    </aside>
  );
}

export default ContextBar;
