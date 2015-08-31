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

const VIEWER_DATA =
  { keyUnique     : GS.uniqueKey
  , keyPrimary    : "name"
  , keySecondary  : "id"

  , itemSchema    : GS.itemSchema
  , itemLabels    : GS.itemLabels

  , routeName     : "groups-editor"
  , routeParam    : "groupID"
//  , routeAdd      : "add-group"

  , textNewItem   : "Add Group"
  , textRemaining : "other groups"
  , textUngrouped : "all groups"

  , groupsInitial : new Set( [ "userCreated", "builtin" ] )
  , groupsAllowed : new Set( [ "userCreated", "builtin" ] )

  , filtersInitial : new Set( )
  , filtersAllowed : new Set( [ "builtin" ] )

  , columnsInitial : new Set(
                      [ "id"
                      , "name"
                      , "builtin"
                      ]
                    )
  , columnsAllowed : new Set(
                      [ "id"
                      , "name"
                      , "builtin"
                      ]
                    )

  , groupBy:
    { userCreated:
       { name: "local groups"
       , testProp: { builtin: false }
       }
    , builtin:
       { name: "built-in system groups"
       , testProp: { builtin: true }
       }
    }
  };

function getUsersList () {
  return { usersList: US.users };
}

function getGroupsList () {
  return { groupsList: GS.groups };
}

const Groups = React.createClass(

  { displayName: "Groups Viewer"

  , getInitialState: function () {
    return getGroupsList();
  }

  , componentDidMount: function () {
    GS.addChangeListener( this.handleGroupsChange );
    GM.requestGroupsList();
    GM.subscribe( this.constructor.displayName );

    US.addChangeListener( this.handleUsersChange );
    UM.requestUsersList();
    UM.subscribe( this.constructor.displayName );

    MS.addChangeListener( this.handleModeSwap );
  }

  , componentWillUnmount: function () {
    GS.removeChangeListener( this.handleGroupsChange );
    GM.unsubscribe( this.constructor.displayName );

    US.removeChangeListener( this.handleUsersChange );
    UM.unsubscribe( this.constructor.displayName );

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
