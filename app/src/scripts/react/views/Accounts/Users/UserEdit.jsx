// USER EDIT TEMPLATE
// ==================
// The edit pane for a user item. Allows the current user to make changes to the
// user item.

"use strict";

import _ from "lodash";
import React from "react";
import { Alert, Button, ButtonToolbar, Input, Grid, Row, Col }
  from "react-bootstrap";

import inputHelpers from "../../../mixins/inputHelpers";
import userMixins from "../../../mixins/userMixins";

import UM from "../../../../flux/middleware/UsersMiddleware";
import US from "../../../../flux/stores/UsersStore";

import GS from "../../../../flux/stores/GroupsStore";

const UserEdit = React.createClass(
  { mixins: [ inputHelpers, userMixins ]

  , propTypes: { item: React.PropTypes.object.isRequired
               , itemSchema: React.PropTypes.object.isRequired
               , itemLabels: React.PropTypes.object.isRequired
               }

  , getInitialState: function () {
      return { modifiedValues: {} };
    }

  , contextTypes: { router: React.PropTypes.func }

  , resetChanges: function () {
    this.setState( { modifiedValues: {} } );
  }

  , handleChange: function ( field, event ) {
    let newModifiedValues = this.state.modifiedValues;

    if ( event.target.type == "checkbox" ) {
      newModifiedValues[ field ] = event.target.checked;
    } else {
      // TODO: using refs is bad, try to find a better way to get the
      // input out of a multi select if it exists
      switch ( this.props.itemSchema.properties[ field ].type ) {
        case "array":
          newModifiedValues[ field ] = this.refs[ field ].getValue();
          break;
        case "integer":
        case "number":
          newModifiedValues[ field ] = _.parseInt( event.target.value );
          break;
        default:
          newModifiedValues[ field ] = event.target.value;
      }
    }
    this.setState( { modifiedValues: newModifiedValues } );
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

  , render: function () {
    let builtInWarning  = null;
    let loggedInUserAlert = null;

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

    if ( this.props.item[ "logged-in" ] ) {
      loggedInUserAlert = (
        <Alert
          bsStyle   = "info"
          className = "text-center"
        >
          <b>{ "This user is currently logged in." }</b>
        </Alert>
      );
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
        value            = { this.state.modifiedValues.id
                          || this.props.item.id
                           }
        onChange         = { this.handleChange.bind( null, "id" ) }
        key              = "id"
        ref              = "id"
        groupClassName   = { this.state.modifiedValues.id
                           ? "editor-was-modified"
                           : ""
                           }
      />;

    let userNameField =
      <Input
        type             = "text"
        label            = "User Name"
        value            = { this.state.modifiedValues.username
                          || this.props.item.username
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

    let userPasswordField = null;
    let userConfirmPasswordField = null;

    let userFullNameField =
      <Input
        type             = "text"
        label            = "Full Name"
        value            = { this.state.modifiedValues.full_name
                          || this.props.item.full_name
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
        value            = { this.state.modifiedValues.email
                          || this.props.item.email
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
        value            = { this.state.modifiedValues.shell
                          || this.props.item.shell
                           }
        onChange         = { this.handleChange.bind( null, "shell" ) }
        key              = "shell"
        ref              = "shell"
        groupClassName   = { this.state.modifiedValues.shell
                           ? "editor-was-modified"
                           : ""
                           }
      >
        { this.generateOptionsList( this.state.shells, "name" ) }
      </Input>;

    let userPrimaryGroupField =
      <Input
        type             = "select"
        label            = "Primary Group"
        value            = { this.state.modifiedValues.group
                          || this.props.item.group
                           }
        onChange         = { this.handleChange.bind( null, "group" ) }
        key              = "group"
        ref              = "group"
        groupClassName   = { this.state.modifiedValues.group
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
        value            = { this.state.modifiedValues.sshpubkey
                          || this.props.item.sshpubkey }
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
        value            = { this.state.modifiedValues.groups
                          || this.props.item.groups
                           }
        onChange         = { this.handleChange.bind( null, "groups" ) }
        key              = "groups"
        ref              = "groups"
        groupClassName   = { this.state.modifiedValues.groups
                           ? "editor-was-modified"
                           : ""
                           }
        multiple
      >
        this.state.modifiedValues.groups = [];
        { this.generateOptionsList( GS.groups, "id", "name" ) }
      </Input>;

    let userLockedField =
      <Input
        type             = "checkbox"
        checked          = { this.state.modifiedValues.locked
                          || this.props.item.locked
                           }
        label            = "Locked"
        defaultValue     = { this.props.item.locked }
        onChange         = { this.handleChange.bind( null, "locked" ) }
        key              = "locked"
        ref              = "locked"
        groupClassName   = { this.state.modifiedValues.locked !== undefined
                           ? "editor-was-modified"
                           : ""
                           }
      />;

    let userSudoField =
      <Input
        type             = "checkbox"
        checked          = { this.state.modifiedValues.sudo
                          || this.props.item.sudo
                           }
        label            = "sudo"
        onChange         = { this.handleChange.bind( null, "sudo" ) }
        key              = "sudo"
        ref              = "sudo"
        groupClassName   = { this.state.modifiedValues.sudo !== undefined
                           ? "editor-was-modified"
                           : ""
                           }
      />;

    let userPasswordDisabledField =
      <Input
        type             = "checkbox"
        label            = "Password Disabled"
        checked          = { this.state.modifiedValues.password_disabled
                          || this.props.item.password_disabled
                           }
        onChange = { this.handleChange.bind( null, "password_disabled" ) }
        key              = "password_disabled"
        ref              = "password_disabled"
        groupClassName = { typeof this.state.modifiedValues.password_disabled
                       === "boolean"
                        && this.state.modifiedValues.password_disabled
                       !== this.props.item.password_disabled
                         ? "editor-was-modified"
                         : ""
                         }
      />;

    let textEditForm =
      <div>
        { userIdField }
        { userNameField }
        { userPasswordField }
        { userConfirmPasswordField }
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
            { loggedInUserAlert }
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
