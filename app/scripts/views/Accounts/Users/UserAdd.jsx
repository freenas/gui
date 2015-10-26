// Add User Template
// =================
// Handles the process of adding a new user. Provides an interface for
// setting up the configurable attributes of a new user.

"use strict";

import _ from "lodash";
import React from "react";
import { History, RouteContext } from "react-router";
import { Button, ButtonToolbar, Grid, Row, Col, Input } from "react-bootstrap";

import US from "../../../flux/stores/UsersStore";
import UM from "../../../flux/middleware/UsersMiddleware";

import GS from "../../../flux/stores/GroupsStore";
import GM from "../../../flux/middleware/GroupsMiddleware";

import inputHelpers from "../../../mixins/inputHelpers";
import userMixins from "../../../mixins/userMixins";
import groupMixins from "../../../mixins/groupMixins";

function generateGroupsOptions ( groups ) {
  var optionList = groups.map( function createGroupOption ( group ) {
                                 return (
                                   <option
                                     key = { group.name }
                                     value = { group.id }
                                   >
                                     { group.name }
                                   </option>
                                 );
                               }
                             );
  return optionList;
}

const UserAdd = React.createClass(
  { mixins: [ inputHelpers, userMixins, History, RouteContext ]

  , propTypes:
    { nextUID: React.PropTypes.number
    , shells: React.PropTypes.array
    , userForm: React.PropTypes.object.isRequired
    , updateUserForm: React.PropTypes.func.isRequired
    , resetUserForm: React.PropTypes.func.isRequired
    }

  , getInitialState: function () {
    return { pleaseCreatePrimaryGroup: true };
  }

  , validateUser () {
    var userValid;

    const usernameValid = typeof this.props.userForm.username === "string"
                       && this.props.userForm.username !== "";

    var groupValid;

    if ( this.state.pleaseCreatePrimaryGroup ) {
      groupValid = true;
    } else if ( typeof this.props.userForm.group === "string" ) {
      userValid = _.find( GS.groups, { name: this.props.userForm.group } )
              !== undefined;
    } else {
      groupValid = false;
    }

    userValid = usernameValid
             && groupValid
             && this.validatePassword()
             && this.validateConfirmPassword();

    return userValid;
  }

  , submitNewUser: function () {
    let newUser = this.state.newUser;

    if ( typeof newUser.id === "string"
      && newUser.id === ""
       ) {
      newUser.id = parseInt( newUser.id );
    } else {
      newUser.id = US.nextUID;
    }

    // If the user requests a new group, make one with the next
    // available GID and the username.
    if ( this.state.pleaseCreatePrimaryGroup ) {
      let newGID = GS.nextGID;
      GM.createGroup( { id   : newGID
                      , name : newUser.username
                      } );
      newUser.group = newGID;
    } else {
      newUser.group = parseInt( newUser.group )
    }

    // Convert the array of strings provided by the form to an array of integers.
    if ( !_.isEmpty( newUser.groups ) ) {
      newUser.groups = this.parseGroupsArray( newUser.groups );
    }

    UM.createUser( newUser );
  }

  , validatePassword () {
    var passwordValid;

    if ( this.state.password_disabled ) {
      passwordValid = true;
    } else {
      passwordValid = typeof this.props.userForm.password === "string"
                   && this.props.userForm.password !== "";
    }

    return passwordValid;
  }

  , validateConfirmPassword () {
    var confirmPasswordValid;

    if ( typeof this.props.userForm.password !== "string"
      || this.props.userForm.password === ""
       ) {
      // if there isn't a password yet, don't bother validating confirmPassword
      confirmPasswordValid = true;
    } else {
      confirmPasswordValid = this.props.userForm.confirmPassword
                         === this.props.userForm.password;
    }

    return confirmPasswordValid;
  }

  , cancel: function () {
    this.history.pushState( null, "/accounts/users" );
  }

  , primaryGroupToggle: function ( event ) {
    this.setState({
      pleaseCreatePrimaryGroup : event.target.checked
    });
  }

  , render: function () {

    let cancelButton =
      <Button
        className = "pull-left"
        onClick = { this.cancel }
        bsStyle = "default"
      >
        { "Cancel" }
      </Button>;

    let resetButton =
      <Button
        className = "pull-left"
        bsStyle = "warning"
        onClick = { this.props.resetUserForm }
      >
        { "Reset Changes" }
      </Button>;

    let submitUserButton =
      <Button
        className = "pull-right"
        disabled = { !this.validateUser() }
        onClick = { this.submitNewUser }
        bsStyle = "info"
      >
        { "Create New User" }
      </Button>;

    let buttonToolbar =
      <ButtonToolbar>
        { cancelButton }
        { resetButton }
        { submitUserButton }
      </ButtonToolbar>;

    let userIdField =
      <Input
        type = "text"
        label = "User ID"
        value = { typeof this.props.userForm.id === "string"
                      && this.props.userForm.id !== ""
                       ? this.props.userForm.id
                       : null
                }
        placeholder = { this.props.nextUID }
        onChange = { ( e ) => this.props.updateUserForm( "id"
                                                       , e.target.value
                                                       ) }
        key = "id"
        ref = "id"
      />;

    let userNameField =
      <Input
        type = "text"
        label = "User Name"
        value = { typeof this.props.userForm.username === "string"
                       ? this.props.userForm.username
                       : null
                }
        onChange = { ( e ) => this.props.updateUserForm( "username"
                                                       , e.target.value
                                                       ) }
        key = "username"
        ref = "username"
        bsStyle = { typeof this.props.userForm.username === "string"
                        && this.props.userForm.username !== ""
                         ? null
                         : "error"
                  }
      />;

    let passwordField =
      <Input
        type = "password"
        label = "Enter Password"
        value = { typeof this.props.userForm.password === "string"
                       ? this.props.userForm.password
                       : ""
                }
        onChange = { ( e ) => this.props.updateUserForm( "password"
                                                       , e.target.value
                                                       ) }
        key = "password"
        ref = "password"
        bsStyle = { this.validatePassword()
                  ? null
                  : "error"
                  }
      />;

    let confirmPasswordField =
      <Input
        type = "password"
        label = "Confirm Password"
        value = { typeof this.props.userForm.confirmPassword === "string"
                       ? this.props.userForm.confirmPassword
                       : ""
                }
        onChange = { ( e ) => this.props.updateUserForm( "confirmPassword"
                                                       , e.target.value
                                                       ) }
        key = "confirmPassword"
        ref = "confirmPassword"
        bsStyle = { this.validateConfirmPassword()
                  ? null
                  : "error"
                  }
      />;

    let userFullNameField =
      <Input
        type = "text"
        label = "Full Name"
        value = { typeof this.props.userForm.full_name === "string"
                       ? this.props.userForm.full_name
                       : null
                       }
        onChange = { ( e ) => this.props.updateUserForm( "full_name"
                                                       , e.target.value
                                                       ) }
        key = "full_name"
        ref = "full_name"
      />;

    let userEmailField =
      <Input
        type = "text"
        label = "email"
        value = { typeof this.props.userForm.email === "string"
                       ? this.props.userForm.email
                       : null
                       }
        onChange = { ( e ) => this.props.updateUserForm( "email"
                                                       , e.target.value
                                                       ) }
        key = "email"
        ref = "email"
      />;

    let userShellField =
      <Input
        type = "select"
        label = "Shell"
        value = { typeof this.props.userForm.shell === "string"
                       ? this.props.userForm.shell
                       : null
                       }
        placeholder = "/bin/sh"
        onChange = { ( e ) => this.props.updateUserForm( "shell".value
                                                       , e.target
                                                       ) }
        key = "shell"
        ref = "shell"
      >
        { this.createSimpleOptions( this.props.shells ) }
      </Input>;

    let userSshPubKeyField =
      <Input
        type = "textarea"
        label = "Public Key"
        value = { typeof this.props.userForm.sshpubkey === "string"
                           ? this.props.userForm.sshpubkey
                           : null
                           }
        onChange = { ( e ) => this.props.updateUserForm( "sshpubkey"
                                                       , e.target.value
                                                       ) }
        key = "sshpubkey"
        ref = "sshpubkey"
        rows = "10"
      />;

    let userGroupsField =
      <Input
        type = "select"
        label = "Other Groups"
        value = { this.props.userForm.groups
                           ? this.props.userForm.groups
                           : null
                           }
        onChange = { ( e ) => this.props.updateUserForm( "groups"
                                                       , e.target.checked
                                                       ) }
        key = "groups"
        ref = "groups"
        multiple
      >
        { generateGroupsOptions( GS.groups ) }
      </Input>;

    let userLockedField =
      <Input
        type = "checkbox"
        checked = { typeof this.props.userForm.locked === "boolean"
                           ? this.props.userForm.locked
                           : null
                           }
        label = "Locked"
        onChange = { ( e ) => this.props.updateUserForm( "locked"
                                                       , e.target.checked
                                                       ) }
        key = "locked"
        ref = "locked"
      />;

    let userSudoField =
      <Input
        type = "checkbox"
        checked = { typeof this.props.userForm.sudo === "boolean"
                           ? this.props.userForm.sudo
                           : null
                           }
        label = "sudo"
        onChange = { ( e ) => this.props.updateUserForm( "sudo"
                                                       , e.target.checked
                                                       ) }
        key = "sudo"
        ref = "sudo"
      />;

    let userPasswordDisabledField =
      <Input
        type = "checkbox"
        label = "Password Disabled"
        checked = { typeof this.props.userForm.password_disabled === "boolean"
                         ? this.props.userForm.password_disabled
                         : null
                         }
        onChange = { ( e ) => this.props.updateUserForm( "password_disabled"
                                                       , e.target.checked
                                                       ) }
        key = "password_disabled"
        ref = "password_disabled"
      />;

    let userAutoPrimaryGroupField =
      <Input
        type = "checkbox"
        label = "Automatically Create Primary Group"
        ref = "createPrimaryGroup"
        onChange = { this.primaryGroupToggle }
        checked = { this.state.pleaseCreatePrimaryGroup }
      />;

    let userPrimaryGroupField = null;

    if ( !this.state.pleaseCreatePrimaryGroup ) {
      let primaryGroupOptions = generateGroupsOptions( GS.groups );
      primaryGroupOptions.unshift( <option
                                     key = { "" }
                                     value = { null }
                                   >
                                     { "" }
                                   </option>
                                 );
      userPrimaryGroupField =
        <Input
          type = "select"
          label = "Primary Group"
          value = { typeof this.props.userForm.group === "string"
                         ? this.props.userForm.group
                         : null
                  }
          onChange = { ( e ) => this.props.updateUserForm( "group"
                                                         , e.target.value
                                                         )
                     }
          key = "group"
          ref = "group"
          bsStyle = { typeof this.props.userForm.group === "string"
                          && this.props.userForm.group !== ""
                           ? null
                           : "error"
                    }
        >
          { primaryGroupOptions }
        </Input>;
    }

    let textEditForm =
      <div>
        { userIdField }
        { userNameField }
        { passwordField }
        { confirmPasswordField }
        { userFullNameField }
        { userEmailField }
        { userShellField }
        { userPrimaryGroupField }
        { userSshPubKeyField }
        { userGroupsField }
      </div>;

    let checkboxEditForm =
      <div>
        { userLockedField }
        { userSudoField }
        { userPasswordDisabledField }
        { userAutoPrimaryGroupField }
      </div>;

    return (
      <div className="viewer-item-info">
        <Grid fluid>
          <Row>
            <Col xs = {12} >
              { buttonToolbar }
            </Col>
          </Row>
          <Row>
            <Col xs = {8} >
              { textEditForm }
            </Col>
            <Col xs = {4} >
              { checkboxEditForm }
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }

});

export default UserAdd;
