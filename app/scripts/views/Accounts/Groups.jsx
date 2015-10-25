// Groups
// ======
// Viewer for FreeNAS groups.

"use strict";

import React from "react";
import _ from "lodash";

import Viewer from "../../components/Viewer";

import GM from "../../flux/middleware/GroupsMiddleware";
import GS from "../../flux/stores/GroupsStore";

import UM from "../../flux/middleware/UsersMiddleware";
import US from "../../flux/stores/UsersStore";
const GROUP_LABELS =
  { name: "Group Name"
  , id: "Group ID"
  , builtin: "Built-in System Group"
  , sudo: "sudo access"
  };

const VIEWER_DATA =
  { keyUnique     : "name"
  , keyPrimary    : "name"
  , keySecondary  : "id"

  , itemSchema    : GS.itemSchema
  , itemLabels    : GROUP_LABELS

  , routeParam    : "groupID"
  , routeNewItem  : "add-group"

  , textNewItem   : "Add Group"
  , textRemaining : "other groups"
  , textUngrouped : "all groups"

  , groupsInitial : new Set( [ "userCreated", "builtin", "sudo" ] )
  , groupsAllowed : new Set( [ "userCreated", "builtin", "sudo" ] )

  , filtersInitial : new Set( )
  , filtersAllowed : new Set( [ "builtin", "sudo" ] )

  , columnsInitial : new Set(
                      [ "id"
                      , "name"
                      , "builtin"
                      , "sudo"
                      ]
                    )
  , columnsAllowed : new Set(
                      [ "id"
                      , "name"
                      , "builtin"
                      , "sudo"
                      ]
                    )

  , modesAllowed: new Set( [ "detail", "table" ] )

  , groupBy:
    { userCreated:
       { name: "local groups"
       , testProp: { builtin: false }
       }
    , builtin:
       { name: "built-in system groups"
       , testProp: { builtin: true }
       }
    , sudo:
      { name: "groups with sudo access"
      , testProp: { sudo: true }
      }
    }
  };

const Groups = React.createClass(

  { displayName: "Groups Viewer"

  , getInitialState: function () {
    return { groupsList: GS.groups
           , nextGID: null
           };
  }

  , componentDidMount: function () {
    GS.addChangeListener( this.handleGroupsChange );
    GM.requestGroupsList();
    GM.requestNextGID();
    GM.subscribe( this.constructor.displayName );

    US.addChangeListener( this.handleUsersChange );
    UM.requestUsersList();
    UM.subscribe( this.constructor.displayName );
  }

  , componentWillUnmount: function () {
    GS.removeChangeListener( this.handleGroupsChange );
    GM.unsubscribe( this.constructor.displayName );

    US.removeChangeListener( this.handleUsersChange );
    UM.unsubscribe( this.constructor.displayName );
  }

  , handleGroupsChange: function ( eventMask ) {
    if ( _.startsWith( eventMask, "group" ) ) {
      this.setState( { groupsList: GS.groups } );
    } else if ( eventMask === "nextGID" ){
      this.setState( { nextGID: GS.nextGID } );
    }
  }

  , handleUsersChange: function ( eventMask ) {
    if ( eventMask === "users" ) {
      this.setState( { usersList: US.users } );
    }
  }

  , render: function () {
    return <Viewer
             itemData = { this.state.groupsList }
             nextGID = { this.state.nextGID }
             params = { this.props.params }
             children = { this.props.children }
             { ...VIEWER_DATA } />;
  }
});

export default Groups;
