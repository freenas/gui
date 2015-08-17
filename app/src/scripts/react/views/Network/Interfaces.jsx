// Interfaces
// ==========
// Viewer for network interfaces.

"use strict";

import React from "react";
import _ from "lodash";

import Viewer from "../../components/Viewer";

import IM from "../../../flux/middleware/InterfacesMiddleware";
import IS from "../../../flux/stores/InterfacesStore";

function getInterfaces () {
  return { interfaces: IS.interfaces };
}

const VIEWER_DATA =
  { keyUnique: IS.uniqueKey
  , keyPrimary: "name"
  , keySecondary: "id"

  , itemSchema: IS.itemSchema
  , itemLabels: IS.itemLabels

  , routeName: "interface-editor"
  , routeParam: "interfaceName"

  , textRemaining: "Other Interfaces"
  , textUngrouped: "All Interfaces"

  , groupsInitial: new Set( [ "active", "inactive", "unknown" ] )
  , groupsAllowed: new Set( [ "active", "inactive", "unknown" ] )

  , filtersInitial: new Set( )
  , filtersAllowed: "link-state"

  , modeInitial: "detail"
  , modesAllowed: new Set( [ "detail" ] )

  , groupBy:
    { active:
      { name: "Active Interfaces"
      , testProp: { "link-state": "LINK_STATE_UP" }
      }
    , inactive:
      { name: "Inactive Interfaces"
      , testProp: { "link-state": "LINK_STATE_DOWN"}
      }
    , unknown:
      { name: "Unknown Interfaces"
      , testProp: { "link-state": "LINK_STATE_UNKNOWN"}
      }
    }
  }

const Interfaces = React.createClass(
  { displayName: "Interfaces Viewer"

  , getInitialState: function () {
    return getInterfaces();
  }

  , componentDidMount: function () {
    IS.addChangeListener( this.handleInterfacesChange );
    IM.requestInterfacesList();
    IM.subscribe( this.constructor.displayName )
  }

  , componentWillUnmount: function () {
    IS.removeChangeListener( this.handleInterfacesChange );
    IM.unsubscribe( this.constructor.displayName );
  }

  , handleInterfacesChange: function () {
    this.setState( getInterfaces() );
  }

  , render: function () {
    console.log(this.state)
    return <Viewer
             header = "Interfaces"
             itemData = { this.state.interfaces }
             { ...VIEWER_DATA } />
  }

});

export default Interfaces;
