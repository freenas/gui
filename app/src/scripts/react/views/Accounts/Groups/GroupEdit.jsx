// Groups Editor Component
// =======================
// The edit pane for an individual group.

"use strict";

import _ from "lodash";
import React from "react";
import { Input, Button, ButtonToolbar, Alert, Grid, Row, Col }
  from "react-bootstrap";

import GM from "../../../../flux/middleware/GroupsMiddleware";
import GS from "../../../../flux/stores/GroupsStore";

import US from "../../../../flux/stores/UsersStore";

import groupMixins from "../../../mixins/groupMixins";

const GroupEdit = React.createClass(

  { propTypes:
    { itemSchema: React.PropTypes.object.isRequired
    , itemLabels: React.PropTypes.object.isRequired
    , item: React.PropTypes.object.isRequired
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

    newGroupProps = GS.reverseKeyTranslation( newGroupProps );

    GM.updateGroup( this.props.item[ "groupID" ], newGroupProps );
  }

  , render: function () {
    let builtInWarning = null;

    if ( this.props.item[ "builtIn" ] ) {
      builtInWarning =
        <Alert
          bsStyle = { "warning" }
          className = { "text-center built-in-warning" } >
          { "This is a built-in system group. Only edit this group if you "
          + "know exactly what you are doing." }
        </Alert>;
    }

    let groupNameValue = this.state.modifiedValues[ "groupName" ]
                      || this.props.item[ "groupName" ];

    let groupNameClass = this.state.modifiedValues[ "groupName" ]
                       ? "editor-was-modified"
                       : "";

    let groupNameField =
      <Input
        className = { groupNameClass }
        type = "text"
        label = { this.props.itemLabels.properties[ "groupName" ] }
        value = { groupNameValue }
        onChange = { this.handleChange.bind( null, "groupName" ) } />;

    let resetButton =
      <Button
        className = "pull-right"
        bsStyle = "warning"
        onClick = { this.resetChanges } >
        { "Reset Changes" }
      </Button>;

    let submitButton =
      <Button
        className = "pull-right"
        bsStyle = "success"
        onClick = { this.submitChanges } >
        { "Submit Changes" }
      </Button>;

    let cancelButton =
      <Button
        className = "pull-left"
        bsStyle = "default"
        onClick = { this.props.handleViewChange.bind( null, "view" ) } >
        { "Cancel Edit" }
      </Button>;

    let deletebutton =
      <Button
        className = "pull-left"
        bsStyle = "danger"
        onClick = { this.deleteGroup }
        disabled = { this.props.item[ "builtIn" ] } >
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
          { this.props.itemLabels.properties[ "groupID" ] + ": " }
        </strong>
        { this.props.item[ "groupID" ] }
      </div>;

    return (
      <Grid fluid>
        <Row>
          <Col
            xs = { 12 } >
            { buttonToolbar }
          </Col>
        </Row>
        <Row>
          <Col
            xs = { 12 } >
            { builtInWarning }
          </Col>
        </Row>
        <Row>
          <Col
            xs = { 12 }
            sm = { 6 } >
            { editForm }
          </Col>
          <Col
            xs = { 12 }
            sm = { 6 } >
            { groupIDDisplay }
          </Col>
        </Row>
      </Grid>
    );
  }

});

export default GroupEdit;
