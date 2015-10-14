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

  , handleChange: function ( field, event ) {
    let newUser = this.state.newUser;

    if ( event.target.type == "checkbox" ) {
      newUser[ field ] = event.target.checked;
    } else {
      // TODO: using refs is bad, try to find a better way to get the
      // input out of a multi select if it exists
      switch ( this.props.itemSchema.properties[ field ].type ) {
        case "array":
          newUser[ field ] = this.refs[ field ].getValue();
          break;
        case "integer":
        case "number":
          newUser[ field ] = _.parseInt( event.target.value );
          break;
        default:
          newUser[ field ] = event.target.value;
      }
    }
    this.setState( { newUser: newUser } );
  }

  , validateUser () {
    return true;
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
