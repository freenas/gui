// Users
// =====
// Viewer for FreeNAS user accounts and built-in system users.

"use strict";

import React from "react";
import { connect }  from "react-redux";

import * as USER_ACTIONS from "../../actions/users";
import * as GROUP_ACTIONS from "../../actions/groups";
import * as SHELL_ACTIONS from "../../actions/shells";

import Viewer from "../../components/Viewer";

const USER_SCHEMA =
  { type: "object"
  , properties:
    { username:          { type: "string" }
    , sshpubkey:         { type: [ "string", "null" ] }
    , shell:             { type: "string" }
    , locked:            { type: "boolean" }
    , full_name:         { type: [ "string", "null" ] }
    , home:              { type: "string" }
    , group:             { type: "integer" }
    , id:                { type: "number" }
    , password_disabled: { type: "boolean" }
    , unixhash:          { type: [ "string", "null" ] }
    , sudo:              { type: "boolean" }
    , smbhash:           { type: [ "string", "null" ] }
    , email:             { type: [ "string", "null" ] }
    , groups:
      { items: { type: "integer" }
      , type: "array"
      }
    , sessions:
      { readOnly: true
      , type: "array"
      }
    , builtin:
      { readOnly: true
      , type: "boolean"
      }
    , loggedin:
      { readOnly: true
      , type: "boolean"
      }
    }
  };

const USER_LABELS =
  { username          : "Username"
  , sshpubkey         : "SSH Public Key"
  , shell             : "Shell"
  , locked            : "Locked Account"
  , groups            : "Group Membership"
  , sessions          : "Sessions"
  , unixhash          : "UNIX Hash"
  , sudo              : "sudo Access"
  , smbhash           : "SMB Hash"
  , email             : "email Address"
  , builtin           : "Built-In User"
  , loggedin          : "Online"
  , full_name         : "Full Name"
  , home              : "Home Directory"
  , group             : "Primary Group"
  , id                : "User ID"
  , password_disabled : "Password Disabled"
  };

class Users extends React.Component {
  componentDidMount () {
    this.props.fetchInitialData();
  }

  render () {
    return (
      <Viewer
        { ...this.props }

        keyUnique = { "username" }
        keyPrimary = { "username" }
        keySecondary = { "full_name" }

        itemData = { this.props.users }
        itemSchema = { USER_SCHEMA }
        itemLabels = { USER_LABELS }
        routeParam = { "userID" }
        routeNewItem = { "add-user" }

        textNewItem = { "Add User" }
        textRemaining = { "other user accounts" }
        textUngrouped = { "all user accounts" }

        groupsInitial = { new Set( [ "current", "userCreated", "builtIn" ] ) }
        groupsAllowed = { new Set( [ "userCreated", "builtIn" ] ) }

        filtersInitial = { new Set() }
        filtersAllowed = { new Set( [ "builtIn" ] ) }

        columnsInitial = { new Set([ "id", "builtin", "username", "full_name" ]) }
        columnsAllowed = { new Set([ "id", "builtin", "username", "full_name" ]) }

        modesAllowed = { new Set( [ "detail", "table" ] ) }

        groupBy = {
          { current:
            { name: "current user account"
            , testProp: ( user ) => {
                return user.username === this.props.activeUser
              }
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
        }
      />
    );
  }
}

// FIXME: ben pls
Users.propTypes =
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

  , updateUserForm: React.PropTypes.func.isRequired
  , resetUserForm: React.PropTypes.func.isRequired
  , createUser: React.PropTypes.func.isRequired
  , updateUser: React.PropTypes.func.isRequired
  , deleteUser: React.PropTypes.func.isRequired
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

    // USERS FORMS
    , updateUserForm: ( field, value ) =>
      dispatch( USER_ACTIONS.updateUserForm( field, value ) )
    , resetUserForm: () =>
      dispatch( USER_ACTIONS.resetUserForm() )

    // USERS TASKS
    , createUser: () =>
      dispatch( USER_ACTIONS.createUser() )
    , updateUser: ( userID ) =>
      dispatch( USER_ACTIONS.updateUser( userID ) )
    , deleteUser: ( userID ) =>
      dispatch( USER_ACTIONS.deleteUser( userID ) )
    }
  );
}

export default connect( mapStateToProps, mapDispatchToProps )( Users );
