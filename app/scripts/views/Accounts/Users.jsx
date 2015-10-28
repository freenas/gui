// Users
// =====
// Viewer for FreeNAS user accounts and built-in system users.

"use strict";

import React from "react";
import { connect }  from "react-redux";
import _ from "lodash";

import * as USER_ACTIONS from "../../actions/users";
import * as GROUP_ACTIONS from "../../actions/groups";
import * as SHELL_ACTIONS from "../../actions/shells";

import Viewer from "../../components/Viewer";

import SS from "../../flux/stores/SessionStore";

function testCurrentUser ( user ) {
  return user.username === SS.getCurrentUser();
}

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

const VIEWER_DATA =
  { keyUnique     : "username"
  , keyPrimary    : "username"
  , keySecondary  : "full_name"

  , itemSchema    : USER_SCHEMA
  , itemLabels    : USER_LABELS
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

class Users extends React.Component {
  constructor ( props ) {
    super( props );
    this.displayName = "Users Viewer";
  }

  componentDidMount () {
    this.props.requestUsers();
    this.props.requestNextUID();
    // UM.subscribe( this.constructor.displayName );

    this.props.requestGroups();
    this.props.requestNextGID();
    // GM.subscribe( this.constructor.displayName );

    this.props.fetchShells();
  }

  componentWillUnmount () {
    // UM.unsubscribe( this.constructor.displayName );

    // GM.unsubscribe( this.constructor.displayName );
  }

  render () {
    return <Viewer
             { ...this.props }
             { ...VIEWER_DATA }
           />;
  }
};


// REDUX
function mapStateToProps ( state ) {
  return (
    { shells: state.shells.available
    , itemData: state.users.users
    , userForm: state.users.userForm
    , nextUID: state.users.nextUID
    , groups: state.groups.groups
    , nextGID: state.groups.nextGID
    // requests
    , queryUsersRequests: state.users.queryUsersRequests
    , queryGroupsRequests: state.groups.queryGroupsRequests
    }
  );
}

function mapDispatchToProps ( dispatch ) {
  return (
    // FORM
    { updateUserForm: ( field, value ) =>
        dispatch( USER_ACTIONS.updateUserForm( field, value ) )
    , resetUserForm: () => dispatch( USER_ACTIONS.resetUserForm() )
    // QUERIES
    , fetchShells: () => dispatch( SHELL_ACTIONS.fetchShells() )
    , requestUsers: () => dispatch( USER_ACTIONS.requestUsers() )
    , requestNextUID: () => dispatch( USER_ACTIONS.requestNextUID() )
    , requestGroups: () => dispatch( GROUP_ACTIONS.requestGroups() )
    , requestNextGID: () => dispatch( GROUP_ACTIONS.requestNextGID() )
    // TASKS
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
