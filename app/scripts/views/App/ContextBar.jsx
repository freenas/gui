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
          if ( props.volumes.activeVolume ) {
            if ( props.volumes.clientVolumes.hasOwnProperty( props.volumes.activeVolume ) ) {
              return <TopologyEditContext />;
            } else if ( props.volumes.serverVolumes.hasOwnProperty( props.volumes.activeVolume ) ) {
              // TODO: The thing for volumes that exist
            }
          }

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

ContextBar.propTypes =
  { location: React.PropTypes.object
  , volumes: React.PropTypes.object // TODO: Ahahahaha, good grief. :(
  }

export default ContextBar;
