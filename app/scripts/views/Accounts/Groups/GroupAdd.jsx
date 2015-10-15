// Add Group Template
// ==================
// Handles the process of adding a new group.

"use strict";

import _ from "lodash";
import React from "react";
import { History, RouteContext } from "react-router";
import { Button, ButtonToolbar, Grid, Row, Col, Input } from "react-bootstrap";

import GS from "../../../flux/stores/GroupsStore";
import GM from "../../../flux/middleware/GroupsMiddleware";


const AddGroup = React.createClass(
  { mixins: [ History, RouteContext ]

  , propTypes:
    { itemSchema: React.PropTypes.object.isRequired
    , itemLabels: React.PropTypes.object.isRequired
    , nextGID: React.PropTypes.number
    }

  , getInitialState: function () {
    return { newGroup: {} };
  }

  , handleChange: function ( field, event ) {
    let newGroup = this.state.newGroup;
    newGroup[ field ] = event.target.value;
    this.setState( { newGroup: newGroup } );
  }

  , submitNewGroup: function () {

    let newGroup = this.state.newGroup;

    if ( typeof newGroup.id === "string" ) {
      newGroup.id = parseInt( newGroup.id );
    } else {
      newGroup.id = this.state.nextGID;
    }

    GM.createGroup( newGroup );
  }

  , cancel: function () {
    this.history.pushState( null, "/accounts/groups" );
  }

  , reset: function () {
    this.setState( { newGroup: {} } );
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

    let submitGroupButton =
      <Button
        className = "pull-right"
        disabled  = { _.isEmpty( this.state.newGroup ) }
        onClick   = { this.submitNewGroup }
        bsStyle   = "info"
      >
        { "Create New Group" }
      </Button>;

    let buttonToolbar =
      <ButtonToolbar>
        { cancelButton }
        { resetButton }
        { submitGroupButton }
      </ButtonToolbar>;

    let inputFields =
      <Row>
        <Col xs = {4}>
          {/* Group id */}
          <Input
            type             = "text"
            min              = { 1000 }
            label            = { this.props.itemLabels.id }
            value            = { typeof this.state.newGroup.id === "string"
                              && this.state.newGroup.id !== ""
                               ? this.state.newGroup.id
                               : null
                               }
            placeholder = { this.props.nextGID }
            onChange         = { this.handleChange.bind( null, "id" ) }
          />
        </Col>
        <Col xs = {8}>
          {/* username */}
          <Input
            type             = "text"
            label            = { this.props.itemLabels.name }
            value            = { this.state.newGroup.name
                              && this.state.newGroup.name !== ""
                               ? this.state.newGroup.name
                               : null
                               }
            onChange         = { this.handleChange.bind( null, "name" ) }
            bsStyle = { typeof this.state.newGroup.id === "string"
                     && this.state.newGroup.id !== ""
                      ? null
                      : "error"
                      }
          />
        </Col>
      </Row>;


    return (
      <div className="viewer-item-info">
        <Grid fluid>
          <Row>
            <Col xs = {12}>
              { buttonToolbar }
            </Col>
          </Row>
          { inputFields }
        </Grid>
      </div>
    );
  }
});

export default AddGroup;
