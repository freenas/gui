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

import inputHelpers from "../../../mixins/inputHelpers";
import userMixins from "../../../mixins/userMixins";

import UM from "../../../../flux/middleware/UsersMiddleware";
import US from "../../../../flux/stores/UsersStore";

import GS from "../../../../flux/stores/GroupsStore";

const UserEdit = React.createClass(
  { mixins: [ inputHelpers, userMixins, History, RouteContext ]

  , propTypes: { item: React.PropTypes.object.isRequired
               , itemSchema: React.PropTypes.object.isRequired
               , shells: React.PropTypes.array
               }

  , getInitialState: function () {
      return { modifiedValues: {} };
    }

  , contextTypes: { router: React.PropTypes.func }

  , resetChanges: function () {
    this.setState( { modifiedValues: {} } );
  }

  , handleChange ( key, event ) {
    var newModifiedValues = _.cloneDeep( this.state.modifiedValues );
    switch ( key ) {
      case "username":
        newModifiedValues.username = event.target.value;
        break;
      case "password":
        newModifiedValues.password = event.target.value;
        break;
      case "confirmPassword":
        this.setState( { confirmPassword: event.target.value } );
        break;
      case "full_name":
        newModifiedValues.full_name = event.target.value;
        break;
      case "email":
        newModifiedValues.email = event.target.value;
        break;
      case "shell":
        newModifiedValues.shell = event.target.value;
        break;
      case "group":
        newModifiedValues.group = event.target.value;
        break;
      case "sshpubkey":
        newModifiedValues.sshpubkey = event.target.value;
        break;
      case "groups":
        newModifiedValues.groups = this.refs.groups.getValue();
        break;
      case "locked":
        newModifiedValues.locked = event.target.checked;
        break;
      case "sudo":
        newModifiedValues.sudo = event.target.checked;
        break;
      case "password_disabled":
        newModifiedValues.password_disabled = event.target.checked;
        break;
    }

    if ( !_.isEqual( newModifiedValues, this.state.modifiedValues) ) {
      this.setState( { modifiedValues: newModifiedValues } );
    }
  }

  , validateUser () {
    return true;
  }

  , submitChanges: function () {

    let newUserProps = this.state.modifiedValues;

    // Convert the array of strings provided by the form to an array of integers.
    if ( !_.isEmpty( newUserProps.groups ) ) {
      newUserProps.groups = this.parseGroupsArray( newUserProps.groups );
    }

    UM.updateUser( this.props.item.id, newUserProps );
  }

  , validatePassword () {
    var passwordValid;

    const password_disabled = typeof this.state.modifiedValues.password_disabled
                        === "boolean"
                          ? this.state.modifiedValues.password_disabled
                          : this.props.item.password_disabled;
    const hasUnixPassword = typeof this.props.item.unixhash === "string"
                         && this.props.item.unixhash !== "*";
    const hasSmbHash = typeof this.props.item.smbHash === "string"
                    && this.props.item.smbHash !== "*";

    if ( password_disabled ) {
      passwordValid = true;
    } else if ( !hasUnixPassword && !hasSmbHash ) {
      passwordValid = typeof this.state.modifiedValues.password === "string"
                   && this.state.modifiedValues.password !== "";
    } else if ( hasUnixPassword || hasSmbHash ) {
      passwordValid = true;
    } else {
      passwordValid = false;
    }

    return passwordValid;
  }

  , validateConfirmPassword () {
    var confirmPasswordValid;

    if ( typeof this.state.modifiedValues.password !== "string"
      || this.state.modifiedValues.password === ""
       ) {
      // if there isn't a password yet, don't bother validating confirmPassword
      confirmPasswordValid = true;
    } else {
      confirmPasswordValid = this.state.confirmPassword
                         === this.state.modifiedValues.password;
    }

    return confirmPasswordValid;
  }

  , render: function () {
    let builtInWarning  = null;

    if ( this.props.item.builtin ) {
      builtInWarning =
        <Alert
          bsStyle   = "warning"
          className = "text-center built-in-warning"
        >
          { "This is a built in user account. Only edit this account if you"
          + "know exactly what you're doing."
          }
        </Alert>;
    }

    let resetButton =
      <Button
        className = "pull-right"
        bsStyle = "warning"
        onClick = { this.resetChanges }
      >
        { "Reset Changes" }
      </Button>;

    let submitButton =
      <Button
        className = "pull-right"
        bsStyle = "success"
        onClick = { this.submitChanges }
        disabled = { !this.validateUser }
      >
        { "Submit Changes" }
      </Button>;

    let cancelButton =
      <Button
        className = "pull-left"
        bsStyle = "default"
        onClick = { this.props.handleViewChange.bind( null, "view" ) }
      >
        { "Cancel Edit" }
      </Button>;

    let deletebutton =
      <Button
        className = "pull-left"
        bsStyle = "danger"
        onClick = { this.deleteUser }
        disabled = { this.props.item.builtin }
      >
        { "Delete User" }
      </Button>;

    let buttonToolbar =
        <ButtonToolbar>
          { cancelButton }
          { deletebutton }
          { resetButton }
          { submitButton }
        </ButtonToolbar>;

    let userIdField =
      <Input
        type             = "text"
        label            = "User ID"
        value            = { typeof this.state.modifiedValues.id === "string"
                           ? this.state.modifiedValues.id
                           : this.props.item.id
                           }
        onChange         = { this.handleChange.bind( null, "id" ) }
        key              = "id"
        ref              = "id"
        groupClassName   = { typeof this.state.modifiedValues.id === "string"
                          && this.state.modifiedValues.id
                         !== this.props.item.id
                           ? "editor-was-modified"
                           : ""
                           }
      />;

    let userNameField =
      <Input
        type             = "text"
        label            = "User Name"
        value            = { typeof this.state.modifiedValues.username
                         === "string"
                           ? this.state.modifiedValues.username
                           : this.props.item.username
                           }
        onChange         = { this.handleChange.bind( null, "username" ) }
        key              = "username"
        ref              = "username"
        groupClassName   = { typeof this.state.modifiedValues.username
                         === "string"
                          && this.state.modifiedValues.username
                         !== this.props.item.username
                           ? "editor-was-modified"
                           : ""
                           }
      />;

    let passwordField =
      <Input
        type             = "password"
        label            = "Enter Password"
        value            = { typeof this.state.modifiedValues.password
                         === "string"
                           ? this.state.modifiedValues.password
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
        value            = { typeof this.state.modifiedValues.full_name
                         === "string"
                           ? this.state.modifiedValues.full_name
                           : this.props.item.full_name
                           }
        onChange         = { this.handleChange.bind( null, "full_name" ) }
        key              = "full_name"
        ref              = "full_name"
        groupClassName   = { typeof this.state.modifiedValues.full_name
                         === "string"
                          && this.state.modifiedValues.full_name
                         !== this.props.item.full_name
                           ? "editor-was-modified"
                           : ""
                           }
    />;

    let userEmailField =
      <Input
        type             = "text"
        label            = "email"
        value            = { typeof this.state.modifiedValues.email === "string"
                           ? this.state.modifiedValues.email
                           : this.props.item.email
                           }
        onChange         = { this.handleChange.bind( null, "email" ) }
        key              = "email"
        ref              = "email"
        groupClassName   = { typeof this.state.modifiedValues.email === "string"
                          && this.state.modifiedValues.email
                         !== this.props.item.email
                           ? "editor-was-modified"
                           : ""
                           }
    />;

    let userShellField =
      <Input
        type             = "select"
        label            = "Shell"
        value            = { typeof this.state.modifiedValues.shell === "string"
                           ? this.state.modifiedValues.shell
                           : this.props.item.shell
                           }
        onChange         = { this.handleChange.bind( null, "shell" ) }
        key              = "shell"
        ref              = "shell"
        groupClassName   = { typeof this.state.modifiedValues.shell === "string"
                          && this.state.modifiedValues.shell
                         !== this.props.item.shell
                           ? "editor-was-modified"
                           : ""
                           }
      >
        { this.createSimpleOptions( this.props.shells ) }
      </Input>;

    let userPrimaryGroupField =
      <Input
        type             = "select"
        label            = "Primary Group"
        value            = { typeof this.state.modifiedValues.group === "string"
                           ? this.state.modifiedValues.group
                           : this.props.item.group
                           }
        onChange         = { this.handleChange.bind( null, "group" ) }
        key              = "group"
        ref              = "group"
        groupClassName   = { typeof this.state.modifiedValues.group === "string"
                          && this.state.modifiedValues.group
                         !== this.props.item.group
                           ? "editor-was-modified"
                           : ""
                           }
      >
        { this.generateOptionsList( GS.groups, "id", "name" ) }
      </Input>;

    let userSshPubKeyField =
      <Input
        type             = "textarea"
        label            = "Public Key"
        value            = { typeof this.state.modifiedValues.sshpubkey
                         === "string"
                           ? this.state.modifiedValues.sshpubkey
                           : this.props.item.sshpubkey }
        onChange         = { this.handleChange.bind( null, "sshpubkey" ) }
        key              = "sshpubkey"
        ref              = "sshpubkey"
        groupClassName   = { typeof this.state.modifiedValues.sshpubkey
                         === "string"
                          && this.state.modifiedValues.sshpubkey
                         !== this.props.item.sshpubkey
                           ? "editor-was-modified"
                           : ""
                           }
        rows             = "10"
      />;

    let userGroupsField =
      <Input
        type             = "select"
        label            = "Other Groups"
        value            = { Array.isArray( this.state.modifiedValues.groups )
                           ? this.state.modifiedValues.groups
                           : this.props.item.groups
                           }
        onChange         = { this.handleChange.bind( null, "groups" ) }
        key              = "groups"
        ref              = "groups"
        groupClassName   = { Array.isArray( this.state.modifiedValues.groups )
                          && !_.isEqual( this.state.modifiedValues.groups
                                       , this.props.item.groups
                                       )
                           ? "editor-was-modified"
                           : ""
                           }
        multiple
      >
        { this.generateOptionsList( GS.groups, "id", "name" ) }
      </Input>;

    let userLockedField =
      <Input
        type             = "checkbox"
        checked          = { typeof this.state.modifiedValues.locked
                         === "boolean"
                           ? this.state.modifiedValues.locked
                           : this.props.item.locked
                           }
        label            = "Locked"
        onChange         = { this.handleChange.bind( null, "locked" ) }
        key              = "locked"
        ref              = "locked"
      />;

    let userSudoField =
      <Input
        type             = "checkbox"
        checked          = { typeof this.state.modifiedValues.sudo === "boolean"
                           ? this.state.modifiedValues.sudo
                           : this.props.item.sudo
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
        checked          = {typeof this.state.modifiedValues.password_disabled
                       === "boolean"
                           ? this.state.modifiedValues.password_disabled
                           : this.props.item.password_disabled
                           }
        onChange = { this.handleChange.bind( null, "password_disabled" ) }
        key              = "password_disabled"
        ref              = "password_disabled"
      />;

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
