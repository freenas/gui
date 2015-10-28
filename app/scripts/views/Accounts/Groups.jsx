// Groups
// ======
// Viewer for FreeNAS groups.

"use strict";

import React from "react";
import { connect }  from "react-redux";
import _ from "lodash";

import * as USER_ACTIONS from "../../actions/users";
import * as GROUP_ACTIONS from "../../actions/groups";
import * as SHELL_ACTIONS from "../../actions/shells";

import Viewer from "../../components/Viewer";

const GROUP_SCHEMA =
  { type: "object"
  , properties:
    { name: { type: "string" }
    , id: { type: "number" }
    , builtin: { type: [ "boolean", "null" ] }
    , sudo: { type: "boolean" }
    }
  };

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

  , itemSchema    : GROUP_SCHEMA
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

class Groups extends React.Component{
  constructor ( props ) {
    super( props );
    this.displayName = "Groups Viewer"
  }

  componentDidMount () {
    this.props.requestGroups();
    this.props.requestNextGID();
    // GM.subscribe( this.constructor.displayName );

    this.props.requestUsers();
    // UM.subscribe( this.constructor.displayName );
  }

  componentWillUnmount () {
    // GM.unsubscribe( this.constructor.displayName );

    // UM.unsubscribe( this.constructor.displayName );
  }

  render () {
    return <Viewer
             { ...this.props }
             { ...VIEWER_DATA }
           />;
  }
};

function mapStateToProps ( state ) {
  return (
    { itemData: state.groups.groups
    , groupForm: state.groups.groupForm
    , nextGID: state.groups.nextGID
    , users: state.users.users
    // requests
    , queryGroupsRequests: state.groups.queryGroupsRequests
    , queryUsersRequests: state.users.queryUsersRequests
    }
  );
}

function mapDispatchToProps ( dispatch ) {
  return (
    // FORM
    { updateGroupForm: ( field, value ) =>
        dispatch( GROUP_ACTIONS.updateGroupForm( field, value ) )
    , resetGroupForm: () => dispatch( GROUP_ACTIONS.resetGroupForm() )
    // QUERIES
    , requestGroups: () => dispatch( GROUP_ACTIONS.requestGroups() )
    , requestNextGID: () => dispatch( GROUP_ACTIONS.requestNextGID() )
    , requestUsers: () => dispatch( USER_ACTIONS.requestUsers() )
    // TASKS
    , createGroup: () =>
        dispatch( GROUP_ACTIONS.createGroup() )
    , updateGroup: ( groupID ) =>
        dispatch( GROUP_ACTIONS.updateGroup( groupID ) )
    , deleteGroup: ( groupID ) =>
        dispatch( GROUP_ACTIONS.deleteGroup( groupID ) )
    }
  );
}

export default connect( mapStateToProps, mapDispatchToProps )( Groups );
