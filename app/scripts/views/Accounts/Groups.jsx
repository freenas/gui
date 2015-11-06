// Groups
// ======
// Viewer for FreeNAS groups.

"use strict";

import React from "react";
import { connect }  from "react-redux";

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

class Groups extends React.Component {
  componentDidMount () {
    this.props.fetchInitialData();
  }

  render () {
    return (
      <Viewer
        { ...this.props }

        keyUnique = "name"
        keyPrimary = "name"
        keySecondary = "id"

        itemData = { this.props.groups }
        itemSchema = { GROUP_SCHEMA }
        itemLabels = { GROUP_LABELS }

        routeParam = "groupID"
        routeNewItem = "add-group"

        textNewItem = "Add Group"
        textRemaining = "other groups"
        textUngrouped = "all groups"

        groupsInitial = { new Set([ "userCreated", "builtin", "sudo" ]) }
        groupsAllowed = { new Set([ "userCreated", "builtin", "sudo" ]) }

        filtersInitial = { new Set() }
        filtersAllowed = { new Set([ "builtin", "sudo" ]) }

        columnsInitial = { new Set([ "id", "name", "builtin", "sudo" ]) }
        columnsAllowed = { new Set([ "id", "name", "builtin", "sudo" ]) }

        modesAllowed = { new Set([ "detail", "table" ]) }

        groupBy = {
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
        }
      />
    );
  }
}


// FIXME: ben pls
Groups.propTypes =
  { shells: React.PropTypes.any
  , users: React.PropTypes.any
  , userForm: React.PropTypes.any
  , nextUID: React.PropTypes.any
  , groups: React.PropTypes.any
  , nextGID: React.PropTypes.any
  , activeUser: React.PropTypes.any
  // requests
  , queryUsersRequests: React.PropTypes.instanceOf( Set ).isRequired
  , queryGroupsRequests: React.PropTypes.instanceOf( Set ).isRequired

  , updateGroupForm: React.PropTypes.func.isRequired
  , resetGroupForm: React.PropTypes.func.isRequired
  , createGroup: React.PropTypes.func.isRequired
  , updateGroup: React.PropTypes.func.isRequired
  , deleteGroup: React.PropTypes.func.isRequired
  };


// REDUX
function mapStateToProps ( state ) {
  return (
    { shells: state.shells.available

    // USERS
    , activeUser: state.auth.activeUser
    , users: state.users.users
    , userForm: state.users.userForm
    , nextUID: state.users.nextUID

    // GROUPS
    , groups: state.groups.groups
    , groupForm: state.groups.groupForm
    , nextGID: state.groups.nextGID

    // requests
    , queryUsersRequests: state.users.queryUsersRequests
    , queryGroupsRequests: state.groups.queryGroupsRequests
    }
  );
}

function mapDispatchToProps ( dispatch ) {
  return (
    { fetchInitialData: () => {
        dispatch( SHELL_ACTIONS.fetchShells() );
        dispatch( USER_ACTIONS.requestUsers() );
        dispatch( USER_ACTIONS.requestNextUID() );
        dispatch( GROUP_ACTIONS.requestGroups() );
        dispatch( GROUP_ACTIONS.requestNextGID() );
      }

    // GROUPS FORMS
    , updateGroupForm: ( field, value ) =>
      dispatch( GROUP_ACTIONS.updateGroupForm( field, value ) )
    , resetGroupForm: () =>
      dispatch( GROUP_ACTIONS.resetGroupForm() )

    // GROUPS TASKS
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
