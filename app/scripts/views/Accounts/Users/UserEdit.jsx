// USER EDIT TEMPLATE
// ==================
// The edit pane for a user item. Allows the current user to make changes to the
// user item.

"use strict";

import _ from "lodash";
import React from "react";
import { Alert, Button, ButtonToolbar, Input, Grid, Row, Col }
  from "react-bootstrap";
import { History, RouteContext } from "react-router";

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

function createShellOptions ( shellsArray ) {
  var shellOptions =
    shellsArray.map(
       function mapShellOption ( shellString, index ) {
         return (
           <option
             value = { shellString }
             key = { index }>
             { shellString }
           </option>
         );
       }
    );
  return shellOptions;
}

const UserEdit = React.createClass(
  { mixins: [ History, RouteContext ]

  , propTypes: { item: React.PropTypes.object.isRequired
               , itemSchema: React.PropTypes.object.isRequired
               , shells: React.PropTypes.array
               , userForm: React.PropTypes.object.isRequired
               , handleViewChange: React.PropTypes.func.isRequired
               , updateUserForm: React.PropTypes.func.isRequired
               , resetUserForm: React.PropTypes.func.isRequired
               , updateUser: React.PropTypes.func.isRequired
               , deleteUser: React.PropTypes.func.isRequired
               }

  // TODO: Enforce limited editing here, as well.
  , validateUser () {
    const usernameToCheck = typeof this.props.userForm.username === "string"
                          ? this.props.userForm.username
                          : this.props.item.username;
    const usernameValid = usernameToCheck !== "";

    const groupToCheck = typeof this.props.userForm.group === "string"
                       ? this.props.userForm.group
                       : this.props.item.group;

    const groupValid = groupToCheck !== "";

    const userValid = usernameValid
                   && groupValid
                   && this.validatePassword()
                   && this.validateConfirmPassword()
                   && !_.isEmpty( this.props.userForm );

    return userValid;
  }

  , validatePassword () {
    var passwordValid;

    const password_disabled = typeof this.props.userForm.password_disabled
                          === "boolean"
                            ? this.props.userForm.password_disabled
                            : this.props.item.password_disabled;
    const hasUnixPassword = typeof this.props.item.unixhash === "string"
                         && this.props.item.unixhash !== "*";
    const hasSmbHash = typeof this.props.item.smbHash === "string"
                    && this.props.item.smbHash !== "*";

    // Don't bother validating the password if none has been entered
    if ( typeof this.props.userForm.password !== "string"
      || this.props.userForm.password === ""
       ) {
      passwordValid = true;
    } else if ( password_disabled ) {
      passwordValid = true;
    } else if ( !hasUnixPassword && !hasSmbHash ) {
      passwordValid = typeof this.props.userForm.password === "string"
                   && this.props.userForm.password !== "";
    } else if ( hasUnixPassword || hasSmbHash ) {
      passwordValid = true;
    } else {
      passwordValid = false;
    }

    return passwordValid;
  }

  , validateConfirmPassword () {
    var confirmPasswordValid = false;

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

  , render: function () {
    const usernameValue = typeof this.props.userForm.username === "string"
                        ? this.props.userForm.username
                        : this.props.item.username;
    const idValue = typeof this.props.userForm.id === "number"
                 || typeof this.props.userForm.id === "string"
                  ? this.props.userForm.id
                  : this.props.item.id;
    const passwordValue = typeof this.props.userForm.password === "string"
                        ? this.props.userForm.password
                        : null;
    const confirmPasswordValue = typeof this.props.userForm.confirmPassword
                             === "string"
                               ? this.props.userForm.confirmPassword
                               : null;
    const fullNameValue = typeof this.props.userForm.full_name === "string"
                         ? this.props.userForm.full_name
                         : this.props.item.full_name;
    const emailValue = typeof this.props.userForm.email === "string"
                     ? this.props.userForm.email
                     : this.props.item.email;
    const shellValue = typeof this.props.userForm.shell === "string"
                     ? this.props.userForm.shell
                     : this.props.item.shell;
    const groupValue = typeof this.props.userForm.group === "string"
                     ? this.props.userForm.group
                     : this.props.item.group;
    const sshpubkeyValue = typeof this.props.userForm.sshpubkey === "string"
                         ? this.props.userForm.sshpubkey
                         : this.props.item.sshpubkey;
    const groupsValue = typeof this.props.userForm.groups === "array"
                      ? this.props.userForm.groups
                      : this.props.item.groups;
    const lockedValue = typeof this.props.userForm.locked === "boolean"
                      ? this.props.userForm.locked
                      : this.props.item.locked;
    const sudoValue = typeof this.props.userForm.sudo === "boolean"
                    ? this.props.userForm.sudo
                    : this.props.item.sudo;
    const password_disabledValue = typeof this.props.userForm.password_disabled
                               === "boolean"
                                 ? this.props.userForm.password_disabled
                                 : this.props.item.password_disabled;
    const groupOptions = generateGroupsOptions( this.props.groups );
    // const groupDisplay = generateGroupsDisplay( this.props.item.groups
    //                                           , this.props.groups
    //                                           );
    var builtInWarning  = null;
    var userIdField = null;
    var userNameField = null;
    var passwordField = null;
    var confirmPasswordField = null;
    var userFullNameField = null;
    var userEmailField = null;
    var userShellField = null;
    var userPrimaryGroupField = null;
    var userSshPubKeyField = null;
    var userGroupsField = null;
    var userLockedField = null;
    var userSudoField = null;
    var userPasswordDisabledField = null;

    if ( this.props.item.id === 0 || this.props.item.id === "0" ) {
      builtInWarning =
        <Alert
          bsStyle = "warning"
          className = "text-center built-in-warning"
        >
          { "This is the root user account, so editing is limited. Only edit "
          + "this account if you know exactly what you're doing."
          }
        </Alert>;
    } else if ( this.props.item.builtin ) {
      builtInWarning =
        <Alert
          bsStyle = "warning"
          className = "text-center built-in-warning"
        >
          { "This is a built-in user account and may not be edited." }
        </Alert>;
    }

    const resetButton =
      <Button
        className = "pull-right"
        bsStyle = "default"
        onClick = { this.props.resetUserForm }
        // disabled = { /* Need a check for this */ }
      >
        { "Reset Changes" }
      </Button>;

    const submitButton =
      <Button
        className = "pull-right"
        bsStyle = "success"
        onClick = { () => this.props.updateUser( this.props.item.id ) }
        disabled = { !this.validateUser() }
      >
        { "Submit Changes" }
      </Button>;

    const cancelButton =
      <Button
        className = "pull-left"
        bsStyle = "default"
        onClick = { this.props.handleViewChange.bind( null, "view" ) }
      >
        { "Cancel Edit" }
      </Button>;

    var deleteButton = null;
    if ( this.props.item.id === 0
      || this.props.item.id === "0"
       ) {
      deleteButton = (
        <Button
          className = "pull-left"
          bsStyle = "danger"
          onClick = { () => this.props.deleteUser( this.props.item.id ) }
        >
          { "Delete User" }
        </Button>
      );
    }
    const buttonToolbar =
        <ButtonToolbar>
          { cancelButton }
          { deleteButton }
          { resetButton }
          { submitButton }
        </ButtonToolbar>;

    if ( this.props.item.builtin ) {
      userIdField = (
        <div>
          <strong>
            { "User ID: " }
          </strong>
          { this.props.item.id }
        </div>
      );
    } else {
      userIdField =
        <Input
          type = "text"
          label = "User ID"
          value = { idValue }
          onChange = { ( e ) => this.props.updateUserForm( "id"
                                                         , e.target.value
                                                         )
                     }
          key = "id"
          groupClassName = { typeof this.props.userForm.id === "string"
                          && this.props.userForm.id
                         !== this.props.item.id
                           ? "editor-was-modified"
                           : ""
                           }
        />;
    }

    if ( this.props.item.builtin ) {
      userNameField =
        <div>
          <strong>
            { "Username: " }
          </strong>
          { this.props.item.username }
        </div>;
    } else {
      userNameField =
        <Input
          type = "text"
          label = "Login Name"
          value = { usernameValue }
          onChange = { ( e ) => this.props.updateUserForm( "username"
                                                         , e.target.value
                                                         )
                     }
          key = "username"
          groupClassName = { typeof this.props.userForm.username
                         === "string"
                          && this.props.userForm.username
                         !== this.props.item.username
                           ? "editor-was-modified"
                           : ""
                           }
        />;
    }

  if ( this.props.item.id !== 0
    && this.props.item.id !== "0"
    && this.props.item.builtin
     ) {
    // Do nothing, I guess.
  } else {
    passwordField =
      <Input
        type = "password"
        label = "Change Password"
        value = { passwordValue }
        onChange = { ( e ) => this.props.updateUserForm( "password"
                                                       , e.target.value
                                                       )
                   }
        key = "password"
        bsStyle = { this.validatePassword()
                  ? null
                  : "error"
                  }
      />;
    }

    if ( this.props.item.id !== 0
    && this.props.item.id !== "0"
    && this.props.item.builtin
     ) {
      // Do nothing, I guess.
    } else {
      confirmPasswordField =
        <Input
          type = "password"
          label = "Confirm New Password"
          value = { typeof this.props.userForm.confirmPassword === "string"
                  ? this.props.userForm.confirmPassword
                  : ""
                  }
          onChange = { ( e ) => this.props.updateUserForm( "confirmPassword"
                                                         , e.target.value
                                                         )
                     }
          key = "confirmPassword"
          bsStyle = { this.validateConfirmPassword()
                  ? null
                  : "error"
                  }
        />;
    }

    if ( this.props.item.id !== 0
    && this.props.item.id !== "0"
    && this.props.item.builtin
     ) {
      userFullNameField =
        <div>
          <strong>
            { "Full Name: " }
          </strong>
          { this.props.item.full_name }
        </div>;
    } else {
      userFullNameField =
        <Input
          type = "text"
          label = "Full Name"
          value = { fullNameValue }
          onChange = { ( e ) => this.props.updateUserForm( "full_name"
                                                         , e.target.value
                                                         )
                     }
          key = "full_name"
          groupClassName = { typeof this.props.userForm.full_name
                         === "string"
                          && this.props.userForm.full_name
                         !== this.props.item.full_name
                           ? "editor-was-modified"
                           : ""
                           }
        />;
    }

    if ( this.props.item.id !== 0
    && this.props.item.id !== "0"
    && this.props.item.builtin
     ) {
      userEmailField =
        <div>
          <strong>
            { "Username: " }
          </strong>
          { this.props.item.email }
        </div>;
    } else {
      userEmailField =
        <Input
          type = "text"
          label = "Email Address"
          value = { emailValue }
          onChange = { ( e ) => this.props.updateUserForm( "email"
                                                         , e.target.value
                                                         )
                     }
          key = "email"
          groupClassName = { typeof this.props.userForm.email === "string"
                          && this.props.userForm.email
                         !== this.props.item.email
                           ? "editor-was-modified"
                           : ""
                           }
        />;
    }

    if ( this.props.item.id !== 0
    && this.props.item.id !== "0"
    && this.props.item.builtin
     ) {
      userShellField =
        <div>
          <strong>
            { "Shell: " }
          </strong>
          { this.props.item.shell }
        </div>;
    } else {
      userShellField =
        <Input
          type = "select"
          label = "Default Login Shell"
          value = { shellValue }
          onChange = { ( e ) => this.props.updateUserForm( "shell"
                                                         , e.target.value
                                                         )
                     }
          key = "shell"
          groupClassName = { typeof this.props.userForm.shell === "string"
                          && this.props.userForm.shell
                         !== this.props.item.shell
                           ? "editor-was-modified"
                           : ""
                           }
        >
          { createShellOptions( this.props.shells ) }
        </Input>;
    }

    if ( this.props.item.builtin ) {
      userPrimaryGroupField =
        <div>
          <strong>
            { "Primary Group: " }
          </strong>
          { this.props.item.group /*get group name for this*/ }
        </div>;
    } else {
      userPrimaryGroupField =
        <Input
          type = "select"
          label = "Primary Group"
          value = { groupValue }
          onChange = { ( e ) => this.props.updateUserForm( "group"
                                                         , e.target.value
                                                         )
                     }
          key = "group"
          groupClassName = { typeof this.props.userForm.group === "string"
                          && this.props.userForm.group
                         !== this.props.item.group
                           ? "editor-was-modified"
                           : ""
                           }
        >
          { groupOptions }
        </Input>;
    }

    if ( this.props.item.id !== 0
    && this.props.item.id !== "0"
    && this.props.item.builtin
     ) {
      // Do nothing, I guess.
    } else {
      userSshPubKeyField =
        <Input
          type = "textarea"
          label = "Paste SSH Public Key"
          value = { sshpubkeyValue }
          onChange = { ( e ) => this.props.updateUserForm( "sshpubkey"
                                                         , e.target.value
                                                         )
                     }
          key = "sshpubkey"
          groupClassName = { typeof this.props.userForm.sshpubkey
                         === "string"
                          && this.props.userForm.sshpubkey
                         !== this.props.item.sshpubkey
                           ? "editor-was-modified"
                           : ""
                           }
          rows             = "10"
        />;
    }

    if ( this.props.item.builtin ) {
      userGroupsField =
        <div>
          <strong>
            { "Other Groups: " }
          </strong>
          { /*TODO: Create a groups list*/ }
        </div>;
    } else {
      userGroupsField =
        <Input
          type = "select"
          label = "Also Add to These Groups"
          value = { Array.isArray( this.props.userForm.groups )
                                 ? this.props.userForm.groups
                                 : this.props.item.groups
                                 }
          onChange = { ( e ) => this.props.updateUserForm( "groups"
                                                         , e.target.value
                                                         )
                     }
          key = "groups"
          ref = "groups"
          groupClassName = { Array.isArray( this.props.userForm.groups )
                          && !_.isEqual( this.props.userForm.groups
                                       , this.props.item.groups
                                       )
                           ? "editor-was-modified"
                           : ""
                           }
          multiple
        >
          { groupOptions }
        </Input>;
    }

    if ( this.props.item.builtin ) {
      // Do nothing, I guess.
    } else {
      userLockedField =
        <Input
          type = "checkbox"
          checked = { lockedValue }
          label = "Lock Account"
          onChange = { ( e ) => this.props.updateUserForm( "locked"
                                                         , e.target.checked
                                                         )
                     }
          key = "locked"
        />;
    }

    if ( this.props.item.builtin ) {
      // Do nothing, I guess.
    } else {
      userSudoField =
        <Input
          type = "checkbox"
          checked = { sudoValue }
          label = "Allow sudo"
          onChange = { ( e ) => this.props.updateUserForm( "sudo"
                                                         , e.target.checked
                                                         )
                     }
          key = "sudo"
        />;
    }

    if ( this.props.item.builtin ) {
      // Do nothing, I guess.
    } else {
      userPasswordDisabledField =
        <Input
          type = "checkbox"
          checked = { password_disabledValue }
          label = "Password Login Disabled"
          onChange = { ( e ) => this.props.updateUserForm( "password_disabled"
                                                         , e.target.checked
                                                         )
                     }
          key = "password_disabled"
        />;
    }

    const textEditForm =
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

    const checkboxEditForm =
      <div>
        { userLockedField }
        { userSudoField }
        { userPasswordDisabledField }
      </div>;

    return (
      <Grid fluid>
        <Row>
          <Col xs = {12} >
            { buttonToolbar }
          </Col>
        </Row>
        <Row>
          <Col xs = {12} >
            { builtInWarning }
          </Col>
          <Col xs = {8} >
            { textEditForm }
          </Col>
          <Col xs = {4} >
            { checkboxEditForm }
          </Col>
        </Row>
      </Grid>
    );
  }
});

export default UserEdit;
