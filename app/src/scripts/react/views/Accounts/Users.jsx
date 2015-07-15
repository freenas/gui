// Users
// =====
// Viewer for FreeNAS user accounts and built-in system users.

"use strict";

import React from "react";

import Viewer from "../../components/Viewer";

import UM from "../../../flux/middleware/UsersMiddleware";
import US from "../../../flux/stores/UsersStore";

import GM from "../../../flux/middleware/GroupsMiddleware";
import GS from "../../../flux/stores/GroupsStore";

import MS from "../../../flux/stores/MiddlewareStore";

import SS from "../../../flux/stores/SessionStore";

import dummyUsers from "./Users/default-users";
import dummyGroups from "./Groups/default-groups";

function testCurrentUser ( user ) {
  return user.username === SS.getCurrentUser();
}

const VIEWER_DATA =
  { keyUnique     : US.uniqueKey
  , keyPrimary    : "username"
  , keySecondary  : "full_name"

  , itemSchema    : US.itemSchema
  , itemLabels    : US.itemLabels

  , routeName     : "users-editor"
  , routeParam    : "userID"
  , routeAdd      : "add-user"

  , textNewItem   : "Add User"
  , textRemaining : "other user accounts"
  , textUngrouped : "all user accounts"

  , groupsInitial : new Set( [ "current", "userCreated", "builtIn" ] )
  , groupsAllowed : new Set( [ "userCreated", "builtIn" ] )

  , filtersInitial : new Set( )
  , filtersAllowed : new Set( [ "builtIn" ] )

  , columnsInitial : new Set(
                       [ "id"
                       , "builtIn"
                       , "username"
                       , "fullname"
                       ]
                     )
  , columnsAllowed : new Set(
                     [ "id"
                     , "builtIn"
                     , "username"
                     , "fullname"
                     ]
                     )

  , groupBy:
    { current:
     {/*{ name: "current user account"
     , testProp: testCurrentUser
     }*/}
    , userCreated:
     { name: "local user accounts"
     , testProp: { builtin: false }
     }
    , builtIn:
     { name: "built-in system accounts"
     , testProp: { builtin: true }
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
    usersList = dummyUsers;
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
    groupsList = dummyGroups;
  }
  return { groupsList: groupsList };

  // Old code. Worth keeping until permanent method is established.
  // return { groupsList: GS.groups };
}

const Users = React.createClass(

  { displayName: "Users Viewer"

  , getInitialState: function () {
    return getUsersList();
  }

  , componentDidMount: function () {
    US.addChangeListener( this.handleUsersChange );
    // UM.requestUsersList();
    // UM.subscribe( this.constructor.displayName );

    GS.addChangeListener( this.handleGroupsChange );
    // GM.requestGroupsList();
    // GM.subscribe( this.constructor.displayName );

    MS.addChangeListener( this.handleModeSwap );
  }

  , componentWillUnmount: function () {
    US.removeChangeListener( this.handleUsersChange );
    // UM.unsubscribe( this.constructor.displayName );

    GS.removeChangeListener( this.handleGroupsChange );
    // GM.unsubscribe( this.constructor.displayName );

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
             header   = { "Users" }
             itemData = { this.state.usersList }
             { ...VIEWER_DATA } />;
  }

});

export default Users;
