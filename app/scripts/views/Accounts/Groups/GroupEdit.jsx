// Groups Editor Component
// =======================
// The edit pane for an individual group.

"use strict";

import _ from "lodash";
import React from "react";
import { Input, Button, ButtonToolbar, Alert, Grid, Row, Col }
  from "react-bootstrap";

import groupMixins from "../../../mixins/groupMixins";

const GroupEdit = React.createClass(

  { propTypes:
    { itemSchema: React.PropTypes.object.isRequired
    , item: React.PropTypes.object.isRequired
    , handleViewChange: React.PropTypes.func.isRequired
    }

  , mixins: [ groupMixins ]

  , contextTypes: { router: React.PropTypes.func }

  , getInitialState: function () {
    return { modifiedValues: {} };
  }

  , resetChanges: function () {
    this.setState( { modifiedValues: {} } );
  }

  , handleChange: function ( field, event ) {
    let newModifiedValues = this.state.modifiedValues;
    newModifiedValues[ field ] = event.target.value;
    this.setState( { modifiedValues: newModifiedValues } );
  }

  , submitChanges: function () {

    let newGroupProps = this.state.modifiedValues;

    GM.updateGroup( this.props.item.id, newGroupProps );
  }

  , render: function () {
    let builtinWarning = null;

    if ( this.props.item.builtin ) {
      builtinWarning =
        <Alert
          bsStyle = { "warning" }
          className = { "text-center built-in-warning" } >
          { "This is a built-in system group. Only edit this group if you "
          + "know exactly what you are doing." }
        </Alert>;
    }

    let groupNameValue = this.state.modifiedValues.name
                      || this.props.item.name;

    let groupNameClass = this.state.modifiedValues.name
                       ? "editor-was-modified"
                       : "";

    let groupNameField =
      <Input
        className = { groupNameClass }
        type = "text"
        label = { "Group Name" }
        value = { groupNameValue }
        onChange = { this.handleChange.bind( null, "name" ) }
      />;

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
        onClick = { this.deleteGroup.bind( this ) }
        disabled = { this.props.item.builtin }
      >
        { "Delete Group" }
      </Button>;

    let buttonToolbar =
      <ButtonToolbar >
        { cancelButton }
        { deletebutton }
        { resetButton }
        { submitButton }
      </ButtonToolbar>;

    let editForm =
      <div>
        { groupNameField }
      </div>;

    let groupIDDisplay =
      <div>
        <strong>
          { "Group ID: " }
        </strong>
        { this.props.item.id }
      </div>;

    return (
      <Grid fluid>
        <Row>
          <Col xs = { 12 } >
            { buttonToolbar }
          </Col>
        </Row>
        <Row>
          <Col xs = { 12 } >
            { builtinWarning }
          </Col>
        </Row>
        <Row>
          <Col
            xs = { 12 }
            sm = { 6 }
          >
            { editForm }
          </Col>
          <Col
            xs = { 12 }
            sm = { 6 }
          >
            { groupIDDisplay }
          </Col>
        </Row>
      </Grid>
    );
  }

});

export default GroupEdit;
