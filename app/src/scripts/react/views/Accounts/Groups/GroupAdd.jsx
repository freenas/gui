// Add Group Template
// ==================
// Handles the process of adding a new group.

"use strict";

import _ from "lodash";
import React from "react";
import { Button, ButtonToolbar, Grid, Row, Col, Input } from "react-bootstrap";

import GS from "../../../../flux/stores/GroupsStore";
import GM from "../../../../flux/middleware/GroupsMiddleware";


const AddGroup = React.createClass({

  contextTypes: {
      router: React.PropTypes.func
    }

  , propTypes:
    { itemSchema: React.PropTypes.object.isRequired
    , itemLabels: React.PropTypes.object.isRequired
    }

  , getInitialState: function () {
    return { nextGID: GS.nextGID
           , newGroup: {} };
  }

  , handleChange: function ( field, event ) {
    let newGroup = this.state.newGroup;
    newGroup[ field ] = event.target.value;
    this.setState( { newGroup: newGroup } );
  }

  , submitNewGroup: function () {

    let newGroup = this.state.newGroup;

    if ( _.has( newGroup, "groupID" ) ) {
      newGroup[ "groupID" ] = _.parseInt( newGroup[ "groupID" ] );
    } else {
      newGroup[ "groupID" ] = this.state.nextGID;
    }

    newGroup = GS.reverseKeyTranslation( newGroup );

    GM.createGroup( newGroup );
  }

  , cancel: function () {
    this.context.router.transitionTo( "groups" );
  }

  , reset: function () {
    this.setState( { newGroup: {} } );
  }

  , render: function () {

    let cancelButton =
      <Button
        className = "pull-left"
        onClick   = { this.cancel }
        bsStyle   = "default" >
        { "Cancel" }
      </Button>;

    let resetButton =
      <Button
        className = "pull-left"
        bsStyle = "warning"
        onClick = { this.reset } >
        { "Reset Changes" }
      </Button>;

    let submitGroupButton =
      <Button
        className = "pull-right"
        disabled  = { _.isEmpty( this.state.newGroup ) }
        onClick   = { this.submitNewGroup }
        bsStyle   = "info" >
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
            label            = { this.props.itemLabels.properties[ "groupID" ] }
            value            = { this.state.newGroup[ "groupID" ]
                               ? this.state.newGroup[ "groupID" ]
                               : this.state.nextGID }
            onChange         = { this.handleChange.bind( null, "groupID" ) }
            className        = { _.has( this.state.newGroup, "groupID" )
                              && !_.isEmpty( this.state.newGroup[ "groupID" ] )
                               ? "editor-was-modified"
                               : "" } />
        </Col>
        <Col xs = {8}>
          {/* username */}
          <Input
            type             = "text"
            label            = { this.props.itemLabels.properties[ "groupName" ] }
            value            = { this.state.newGroup[ "groupName" ]
                               ? this.state.newGroup[ "groupName" ]
                               : null }
            onChange         = { this.handleChange.bind( null, "groupName" ) }
            className   = { _.has( this.state.newGroup, "groupName" )
                              && !_.isEmpty( this.state.newGroup[ "groupName" ] )
                               ? "editor-was-modified"
                               : "" } />
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
