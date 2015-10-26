// Group View Component
// ====================
// Handles viewing the properties of a group. Provides no direct editing
// capabilities other than deleting a group completely.


"use strict";

import _ from "lodash";
import React from "react";
import { Alert, ListGroup, ListGroupItem, Grid, Row, Col, Button
       , ButtonToolbar
       }
  from "react-bootstrap";

import routerShim from "../../../mixins/routerShim";
import clientStatus from "../../../mixins/clientStatus";

import viewerUtil from "../../../components/Viewer/viewerUtil";

import UsersStore from "../../../flux/stores/UsersStore";

import groupMixins from "../../../mixins/groupMixins";
import inputHelpers from "../../../mixins/inputHelpers";


const GroupView = React.createClass({

  mixins: [ groupMixins ]

  , contextTypes: {
    router: React.PropTypes.func
  }

  , propTypes: {
      item: React.PropTypes.object.isRequired
    }

  , getMembers: function ( groupid ) {
    if ( UsersStore.getUsersByGroup( groupid ) ) {
      return UsersStore.getUsersByGroup( groupid );
    } else {
      return [];
    }
  }

  , createUserDisplayList: function ( groupid ) {
    var listUserItemArray = [];
    var users = this.getMembers( groupid );

    for ( var i = 0; i < users.length; i++ ) {
      listUserItemArray.push(
        <ListGroupItem>
          { users[i].username }
        </ListGroupItem>
      );
    }

    return listUserItemArray;
  }

  , render: function () {
    var builtInGroupAlert = null;
    var editButtons = null;

    if ( this.props.item.builtin ) {
      builtInGroupAlert = (
        <Alert
          bsStyle = "info"
          className = "text-center"
        >
          <b>{"This is a built-in FreeNAS group."}</b>
        </Alert>
      );
    }

    editButtons = (
      <ButtonToolbar>
        <Button
          className = "pull-left"
          disabled = { this.props.item.builtin }
          onClick = { this.deleteGroup }
          bsStyle = "danger"
        >
          { "Delete Group" }
        </Button>
        <Button
          className = "pull-right"
          onClick = { this.props.handleViewChange.bind( null, "edit" ) }
          bsStyle = "info"
        >
          { "Edit Group" }
        </Button>
      </ButtonToolbar>
    );

    return (
      <Grid fluid>
        {/* "Edit Group" Button - Top */}
        { editButtons }

        <Row>
          <Col
            xs={3}
            className="text-center">
            <viewerUtil.ItemIcon
              primaryString = { this.props.item.name }
              fallbackString = { this.props.item.id }
              seedNumber = { this.props.item.id }
            />
          </Col>
          <Col xs={9}>
            <h3>
              { this.props.item.name }
            </h3>
            <hr />
          </Col>
        </Row>

        {/* Shows a warning if the group account is built in */}
        { builtInGroupAlert }

        {/* Primary group data overview */}

        <Row>
          <Col
            xs = {2}
            className = "text-muted" >
            <h4 className = "text-muted" >
              { "Group Name" }
            </h4>
          </Col>
          <Col xs = {10}>
            <h3>
              { this.props.item.id }
            </h3>
          </Col>
        </Row>
        <Row>
          <Col
            xs = {12}
            className = "text-muted" >
            <h4 className = "text-muted" >
              { "Users" }
            </h4>
            <ListGroup>
              { this.createUserDisplayList( this.props.item.id ) }
            </ListGroup>
          </Col>
        </Row>

      </Grid>
    );
  }
});

export default GroupView;
