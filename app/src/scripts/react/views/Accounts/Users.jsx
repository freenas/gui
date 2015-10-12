// Users
// =====
// Viewer for FreeNAS user accounts and built-in system users.

"use strict";

import React from "react";
import _ from "lodash";

import Viewer from "../../components/Viewer";

import UM from "../../../flux/middleware/UsersMiddleware";
import US from "../../../flux/stores/UsersStore";

import GM from "../../../flux/middleware/GroupsMiddleware";
import GS from "../../../flux/stores/GroupsStore";

import MS from "../../../flux/stores/MiddlewareStore";

import SS from "../../../flux/stores/SessionStore";

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
  , routeNewItem  : "add-user"

  , textNewItem   : "Add User"
  , textRemaining : "other user accounts"
  , textUngrouped : "all user accounts"

  , groupsInitial : new Set( [ "current", "userCreated", "builtIn" ] )
  , groupsAllowed : new Set( [ "userCreated", "builtIn" ] )

  , filtersInitial : new Set( )
  , filtersAllowed : new Set( [ "builtIn" ] )

  , columnsInitial : new Set(
                       [ "id"
                       , "builtin"
                       , "username"
                       , "full_name"
                       ]
                     )
  , columnsAllowed : new Set(
                     [ "id"
                     , "builtin"
                     , "username"
                     , "full_name"
                     ]
                     )

  , modesAllowed: new Set( [ "detail", "table" ] )

  , groupBy:
    { current:
     { name: "current user account"
     , testProp: testCurrentUser
     }
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

const Users = React.createClass(

  { displayName: "Users Viewer"

  , getInitialState: function () {
    return { usersList: []
           , groupsList: []
           , nextUID: null
           };
  }

  , componentDidMount: function () {
    US.addChangeListener( this.handleUsersChange );
    UM.requestUsersList();
    UM.requestNextUID();
    UM.subscribe( this.constructor.displayName );

    GS.addChangeListener( this.handleGroupsChange );
    GM.requestGroupsList();
    GM.subscribe( this.constructor.displayName );

    MS.addChangeListener( this.handleModeSwap );
  }

  , componentWillUnmount: function () {
    US.removeChangeListener( this.handleUsersChange );
    UM.unsubscribe( this.constructor.displayName );

    GS.removeChangeListener( this.handleGroupsChange );
    GM.unsubscribe( this.constructor.displayName );

    MS.removeChangeListener( this.handleModeSwap );
  }

  , handleGroupsChange: function ( eventMask ) {
    if ( _.startsWith( eventMask, "group" ) ) {
      this.setState( { groupsList: GS.groups } );
    }
  }

  , handleUsersChange: function ( eventMask ) {
    if ( _.startsWith( eventMask, "user" ) ) {
      this.setState( { usersList: US.users } );
    } else if ( eventMask === "nextUID" ) {
      this.setState( { nextUID: US.nextUID } );
    }
  }

  , handleModeSwap: function () {
    this.handleUsersChange();
    this.handleGroupsChange();
  }

  , render: function () {
    return <Viewer
             itemData = { this.state.usersList }
             nextUID = { this.state.nextUID }
             { ...VIEWER_DATA } />;
  }

});

export default Users;
