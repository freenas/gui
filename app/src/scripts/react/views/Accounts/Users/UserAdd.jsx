// Add User Template
// =================
// Handles the process of adding a new user. Provides an interface for
// setting up the configurable attributes of a new user.

"use strict";

import _ from "lodash";
import React from "react";
import { History, RouteContext } from "react-router";
import { Button, ButtonToolbar, Grid, Row, Col, Input } from "react-bootstrap";

import US from "../../../../flux/stores/UsersStore";
import UM from "../../../../flux/middleware/UsersMiddleware";

import GS from "../../../../flux/stores/GroupsStore";
import GM from "../../../../flux/middleware/GroupsMiddleware";

import inputHelpers from "../../../mixins/inputHelpers";
import userMixins from "../../../mixins/userMixins";
import groupMixins from "../../../mixins/groupMixins";


const UserAdd = React.createClass(
  { mixins: [ inputHelpers, userMixins, History, RouteContext ]

  , propTypes:
    { itemSchema: React.PropTypes.object.isRequired
    , nextUID: React.PropTypes.number
    , shells: React.PropTypes.array
    }

  , getInitialState: function () {
    return { nextUID: US.nextUID
           , newUser: {}
           , pleaseCreatePrimaryGroup: true
           };
  }

  , handleChange ( key, event ) {
    var newUser = _.cloneDeep( this.state.newUser );
    switch ( key ) {
      case "username":
        newUser.username = event.target.value;
        break;
      case "password":
        newUser.password = event.target.value;
        break;
      case "confirmPassword":
        this.setState( { confirmPassword: event.target.value } );
        break;
      case "full_name":
        newUser.full_name = event.target.value;
        break;
      case "email":
        newUser.email = event.target.value;
        break;
      case "shell":
        newUser.shell = event.target.value;
        break;
      case "group":
        newUser.group = event.target.value;
        break;
      case "sshpubkey":
        newUser.sshpubkey = event.target.value;
        break;
      case "groups":
        newUser.groups = this.refs.groups.getValue();
        break;
      case "locked":
        newUser.locked = event.target.checked;
        break;
      case "sudo":
        newUser.sudo = event.target.checked;
        break;
      case "password_disabled":
        newUser.password_disabled = event.target.checked;
        break;
    }

    if ( !_.isEqual( newUser, this.state.newUser) ) {
      this.setState( { newUser: newUser } );
    }
  }

  , validateUser () {
    var userValid;

    const usernameValid = typeof this.state.newUser.username === "string"
                       && this.state.newUser.username !== "";

    var groupValid;

    if ( this.state.pleaseCreatePrimaryGroup ) {
      groupValid = true;
    } else if ( typeof this.state.newUser.group === "string" ) {
      userValid = _.find( GS.groups, { name: this.state.newUser.group } )
              !== undefined;
    } else {
      groupValid = false;
    }

    userValid = usernameValid
             && groupValid
             && validatePassword()
             && validateConfirmPassword();

    return userValid;
  }

  , submitNewUser: function () {
    let newUser = this.state.newUser;

    if ( typeof newUser.id === "string" ) {
      newUser.id = _.parseInt( newUser.id );
    } else {
      newUser.id = this.state.nextUID;
    }

    // If the user requests a new group, make one with the next
    // available GID and the username.
    if ( this.state.pleaseCreatePrimaryGroup ) {
      let newGID = GS.nextGID;
      GM.createGroup( { id   : newGID
                      , name : newUser.username
                      } );
      newUser.group = newGID;
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
      passwordValid = typeof this.state.newUser.password === "string"
                   && this.state.newUser.password !== "";
    }

    return passwordValid;
  }

  , validateConfirmPassword () {
    var confirmPasswordValid;

    if ( typeof this.state.newUser.password !== "string"
      || this.state.newUser.password === ""
       ) {
      // if there isn't a password yet, don't bother validating confirmPassword
      confirmPasswordValid = true;
    } else {
      confirmPasswordValid = this.state.confirmPassword
                         === this.state.newUser.password;
    }

    return confirmPasswordValid;
  }

  , cancel: function () {
    this.history.pushState( null, "/accounts/users" );
  }

  , reset: function () {
    this.setState( { newUser: {} } );
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
        onClick   = { this.cancel }
        bsStyle   = "default"
      >
        { "Cancel" }
      </Button>;

    let resetButton =
      <Button
        className = "pull-left"
        bsStyle = "warning"
        onClick = { this.reset }
      >
        { "Reset Changes" }
      </Button>;

    let submitUserButton =
      <Button
        className = "pull-right"
        disabled  = { !this.validateUser }
        onClick   = { this.submitNewUser }
        bsStyle   = "info"
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
        type             = "text"
        label            = "User ID"
        value            = { typeof this.state.newUser.id === "string"
                          && this.state.newUser.id !== ""
                           ? this.state.newUser.id
                           : null
                           }
        placeholder      = { this.props.nextUID }
        onChange         = { this.handleChange.bind( null, "id" ) }
        key              = "id"
        ref              = "id"
      />;

    let userNameField =
      <Input
        type             = "text"
        label            = "User Name"
        value            = { typeof this.state.newUser.username === "string"
                           ? this.state.newUser.username
                           : null
                           }
        onChange         = { this.handleChange.bind( null, "username" ) }
        key              = "username"
        ref              = "username"
        bsStyle          = { typeof this.state.newUser.username === "string"
                          && this.state.newUser.username !== ""
                           ? null
                           : "error"
                           }
      />;

    let passwordField =
      <Input
        type             = "password"
        label            = "Enter Password"
        value            = { typeof this.state.newUser.password
                         === "string"
                           ? this.state.newUser.password
                           : ""
                           }
        onChange         = { this.handleChange.bind( null, "password" ) }
        key              = "password"
        ref              = "password"
        bsStyle          = { this.validatePassword()
                           ? null
                           : "error"
                           }
      />;

    let confirmPasswordField =
      <Input
        type             = "password"
        label            = "Confirm Password"
        value            = { typeof this.state.confirmPassword === "string"
                           ? this.state.confirmPassword
                           : ""
                           }
        onChange         = { this.handleChange.bind( null, "confirmPassword" ) }
        key              = "confirmPassword"
        ref              = "confirmPassword"
        bsStyle          = { this.validateConfirmPassword()
                           ? null
                           : "error"
                           }
      />;

    let userFullNameField =
      <Input
        type             = "text"
        label            = "Full Name"
        value            = { typeof this.state.newUser.full_name === "string"
                           ? this.state.newUser.full_name
                           : null
                           }
        onChange         = { this.handleChange.bind( null, "full_name" ) }
        key              = "full_name"
        ref              = "full_name"
      />;

    let userEmailField =
      <Input
        type             = "text"
        label            = "email"
        value            = { typeof this.state.newUser.email === "string"
                           ? this.state.newUser.email
                           : null
                           }
        onChange         = { this.handleChange.bind( null, "email" ) }
        key              = "email"
        ref              = "email"
      />;

    let userShellField =
      <Input
        type             = "select"
        label            = "Shell"
        value            = { typeof this.state.newUser.shell === "string"
                           ? this.state.newUser.shell
                           : null
                           }
        placeholder      = "/bin/sh"
        onChange         = { this.handleChange.bind( null, "shell" ) }
        key              = "shell"
        ref              = "shell"
      >
        { this.createSimpleOptions( this.props.shells ) }
      </Input>;

    let userSshPubKeyField =
      <Input
        type             = "textarea"
        label            = "Public Key"
        value            = { typeof this.state.newUser.sshpubkey === "string"
                           ? this.state.newUser.sshpubkey
                           : null
                           }
        onChange         = { this.handleChange.bind( null, "sshpubkey" ) }
        key              = "sshpubkey"
        ref              = "sshpubkey"
        rows             = "10"
      />;

    let userGroupsField =
      <Input
        type             = "select"
        label            = "Other Groups"
        value            = { this.state.newUser.groups
                           ? this.state.newUser.groups
                           : null
                           }
        onChange         = { this.handleChange.bind( null, "groups" ) }
        key              = "groups"
        ref              = "groups"
        multiple
      >
        { this.generateOptionsList( GS.groups, "id", "name" ) }
      </Input>;

    let userLockedField =
      <Input
        type             = "checkbox"
        checked          = { typeof this.state.newUser.locked === "boolean"
                           ? this.state.newUser.locked
                           : null
                           }
        label            = "Locked"
        onChange         = { this.handleChange.bind( null, "locked" ) }
        key              = "locked"
        ref              = "locked"
      />;

    let userSudoField =
      <Input
        type             = "checkbox"
        checked          = { typeof this.state.newUser.sudo === "boolean"
                           ? this.state.newUser.sudo
                           : null
                           }
        label            = "sudo"
        onChange         = { this.handleChange.bind( null, "sudo" ) }
        key              = "sudo"
        ref              = "sudo"
      />;

    let userPasswordDisabledField =
      <Input
        type             = "checkbox"
        label            = "Password Disabled"
        checked          = { typeof this.state.newUser.password_disabled
                         === "boolean"
                           ? this.state.newUser.password_disabled
                           : null
                           }
        onChange = { this.handleChange.bind( null, "password_disabled" ) }
        key              = "password_disabled"
        ref              = "password_disabled"
      />;

    let userAutoPrimaryGroupField =
      <Input
        type             = "checkbox"
        label            = "Automatically Create Primary Group"
        ref              = "createPrimaryGroup"
        onChange         = { this.primaryGroupToggle }
        checked          = { this.state.pleaseCreatePrimaryGroup }
      />;

    let userPrimaryGroupField;

    if ( !this.state.pleaseCreatePrimaryGroup ) {
      userPrimaryGroupField =
        <Input
          type             = "select"
          label            = "Primary Group"
          value            = { this.state.newUser.group
                           ? this.state.newUser.group
                           : null }
          onChange         = { this.handleChange.bind( null, "group" ) }
          key              = "group"
          ref              = "group"
          groupClassName   = { this.state.newUser.group
                             ? "editor-was-modified"
                             : ""
                             }
        >
          { this.generateOptionsList( GS.groups, "id", "name" ) }
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
