// Add User Template
// =================
// Handles the process of adding a new user. Provides an interface for
// setting up the configurable attributes of a new user.

"use strict";

import _ from "lodash";
import React from "react";
import { Button, ButtonToolbar, Grid, Row, Col, Input } from "react-bootstrap";

import US from "../../../../flux/stores/UsersStore";
import UM from "../../../../flux/middleware/UsersMiddleware";

import GS from "../../../../flux/stores/GroupsStore";
import GM from "../../../../flux/middleware/GroupsMiddleware";

import inputHelpers from "../../../mixins/inputHelpers";
import userMixins from "../../../mixins/userMixins";
import groupMixins from "../../../mixins/groupMixins";


const UserAdd = React.createClass(
  { mixins: [ inputHelpers, userMixins ]

  , contextTypes: {
    router: React.PropTypes.func
  }

  , propTypes:
    { itemSchema: React.PropTypes.object.isRequired
    , itemLabels: React.PropTypes.object.isRequired
    }

  , getInitialState: function () {
    return { nextUID: US.nextUID
           , newUser: {}
           , pleaseCreatePrimaryGroup : true
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
    let params = {};
    let newUser = this.state.newUser;

    if ( _.has( newUser, "id" ) ) {
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
    this.context.router.transitionTo( "users" );
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
        value            = { this.state.newUser.id
                           ? this.state.newUser.id
                           : this.state.nextUID
                           }
        onChange         = { this.handleChange.bind( null, "id" ) }
        key              = "id"
        ref              = "id"
        groupClassName   = { _.has( this.state.newUser.id )
                           ? "editor-was-modified"
                           : ""
                           }
      />;

    let userNameField =
      <Input
        type             = "text"
        label            = "User Name"
        value            = { this.state.newUser.username
                           ? this.state.newUser.username
                           : null
                           }
        onChange         = { this.handleChange.bind( null, "username" ) }
        key              = "username"
        ref              = "username"
        groupClassName   = { _.has( this.state.newUser.username )
                           ? "editor-was-modified"
                           : ""
                           }
      />;

    let userFullNameField =
      <Input
        type             = "text"
        label            = "Full Name"
        value            = { this.state.newUser.full_name
                           ? this.state.newUser.full_name
                           : null
                           }
        onChange         = { this.handleChange.bind( null, "full_name" ) }
        key              = "full_name"
        ref              = "full_name"
        groupClassName   = { _.has( this.state.newUser.full_name )
                           ? "editor-was-modified"
                           : ""
                           }
      />;

    let userEmailField =
      <Input
        type             = "text"
        label            = "email"
        value            = { this.state.newUser.email
                           ? this.state.newUser.email
                           : null
                           }
        onChange         = { this.handleChange.bind( null, "email" ) }
        key              = "email"
        ref              = "email"
        groupClassName   = { _.has( this.state.newUser.email )
                           ? "editor-was-modified"
                           : ""
                           }
      />;

    let userShellField =
      <Input
        type             = "select"
        label            = "Shell"
        value            = { this.state.newUser.shell
                           ? this.state.newUser.shell
                           : null
                           }
        onChange         = { this.handleChange.bind( null, "shell" ) }
        key              = "shell"
        ref              = "shell"
        groupClassName   = { _.has( this.state.newUser.shell )
                           ? "editor-was-modified"
                           : ""
                           }
      >
        { this.generateOptionsList( this.state.shells, "name" ) }
      </Input>;

    let userSshPubKeyField =
      <Input
        type             = "textarea"
        label            = "Public Key"
        value            = { this.state.newUser.sshpubkey
                           ? this.state.newUser.sshpubkey
                           : null
                           }
        onChange         = { this.handleChange.bind( null, "sshpubkey" ) }
        key              = "sshpubkey"
        ref              = "sshpubkey"
        groupClassName   = { this.state.newUser.sshpubkey
                           ? "editor-was-modified"
                           : ""
                           }
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
        groupClassName   = { !_.isEmpty( this.state.newUser.groups )
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
        checked          = { this.state.newUser.locked
                           ? this.state.newUser.locked
                           : null
                           }
        label            = "Locked"
        onChange         = { this.handleChange.bind( null, "locked" ) }
        key              = "locked"
        ref              = "locked"
        groupClassName   = { _.has( this.state.newUser.locked )
                           ? "editor-was-modified"
                           : ""
                           }
      />;

    let userSudoField =
      <Input
        type             = "checkbox"
        checked          = { this.state.newUser.sudo
                           ? this.state.newUser.sudo
                           : null
                           }
        label            = "sudo"
        onChange         = { this.handleChange.bind( null, "sudo" ) }
        key              = "sudo"
        ref              = "sudo"
        groupClassName   = { _.has( this.state.newUser.sudo )
                         ? "editor-was-modified"
                         : ""
                         }
      />;

    let userPasswordDisabledField =
      <Input
        type             = "checkbox"
        label            = "Password Disabled"
        checked          = { this.state.newUser.password_disabled
                         ? this.state.newUser.password_disabled
                         : null
                         }
        onChange = { this.handleChange.bind( null, "password_disabled" ) }
        key              = "password_disabled"
        ref              = "password_disabled"
        groupClassName = { _.has( this.state.newUser.password_disabled )
                         ? "editor-was-modified"
                         : ""
                         }
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
          groupClassName   = { _.has( this.state.newUser.group )
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
