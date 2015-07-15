// Groups
// ======
// Viewer for FreeNAS groups.

"use strict";

import React from "react";

import Viewer from "../../components/Viewer";

import GM from "../../../flux/middleware/GroupsMiddleware";
import GS from "../../../flux/stores/GroupsStore";

import UM from "../../../flux/middleware/UsersMiddleware";
import US from "../../../flux/stores/UsersStore";

import MS from "../../../flux/stores/MiddlewareStore";

import dummyUsers from "./Users/default-users";
import dummyGroups from "./Groups/default-groups";

const VIEWER_DATA =
  { keyUnique     : GS.uniqueKey
  , keyPrimary    : "groupName"
  , keySecondary  : "groupID"

  , itemSchema    : GS.itemSchema
  , itemLabels    : GS.itemLabels

  , routeName     : "groups-editor"
  , routeParam    : "groupID"
  , routeAdd      : "add-group"

  , textNewItem   : "Add Group"
  , textRemaining : "other groups"
  , textUngrouped : "all groups"

  , groupsInitial : new Set( [ "userCreated", "builtIn" ] )
  , groupsAllowed : new Set( [ "userCreated", "builtIn" ] )

  , filtersInitial : new Set( )
  , filtersAllowed : new Set( [ "builtIn" ] )

  , columnsInitial : new Set(
                      [ "groupID"
                      , "groupName"
                      , "builtIn"
                      ]
                    )
  , columnsAllowed : new Set(
                      [ "groupID"
                      , "groupName"
                      , "builtIn"
                      ]
                    )

  , groupBy:
    { userCreated:
       { name: "local groups"
       , testProp: { builtIn: false }
       }
    , builtIn:
       { name: "built-in system groups"
       , testProp: { builtIn: true }
       }
    }
  };

function getUsersList () {
  let usersList = [];
  // KILLME: This is just for a demo. Don't do this unless you know you're about
  // to swap it for the upcoming new method (where this is handled by the
  // virtual middleware).
  if ( MS.getMode() === "DISCONNECTED" ) {
    usersList = US.users;
  } else if ( MS.getMode() === "DISCONNECTED" ) {
    usersList = this.dummyUsers;
  }
  return { usersList: usersList };

  // Old code. Worth keeping until permanent method is established.
  // return { usersList: US.users };
}

function getGroupsList () {
  let groupsList = [];
  // KILLME: This is just for a demo. Don't do this unless you know you're about
  // to swap it for the upcoming new method (where this is handled by the
  // virtual middleware).
  if ( MS.getMode() === "DISCONNECTED" ) {
    groupsList = GS.groups;
  } else if ( MS.getMode() !== "DISCONNECTED" ) {
    groupsList = this.dummyGroups;
  }
  return { groupsList: groupsList };

  // Old code. Worth keeping until permanent method is established.
  // return { groupsList: GS.groups };
}

const Groups = React.createClass(

  { displayName: "Groups Viewer"

  , getInitialState: function () {
    return getGroupsList();
  }

  , componentDidMount: function () {
    GS.addChangeListener( this.handleGroupsChange );
    // GM.requestGroupsList();
    // GM.subscribe( this.constructor.displayName );

    US.addChangeListener( this.handleUsersChange );
    // UM.requestUsersList();
    // UM.subscribe( this.constructor.displayName );

    MS.addChangeListener( this.handleModeSwap );
  }

  , componentWillUnmount: function () {
    GS.removeChangeListener( this.handleGroupsChange );
    // GM.unsubscribe( this.constructor.displayName );

    US.removeChangeListener( this.handleUsersChange );
    // UM.unsubscribe( this.constructor.displayName );

    MS.removeChangeListener( this.handleModeSwap );
  }

  , handleGroupsChange: function () {
    this.setState( getGroupsList() );
  }

  , handleUsersChange: function () {
    this.setState( getUsersList() );
  }

  , handleModeSwap: function () {
    this.handleUsersChange();
    this.handleGroupsChange();
  }

  , render: function () {
    return <Viewer
             header = { "Groups" }
             itemData = { this.state.groupsList }
             { ...VIEWER_DATA } />;
  }
});

export default Groups;
