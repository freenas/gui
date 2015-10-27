// Add Group Template
// ==================
// Handles the process of adding a new group.

"use strict";

import _ from "lodash";
import React from "react";
import { History, RouteContext } from "react-router";
import { Button, ButtonToolbar, Grid, Row, Col, Input } from "react-bootstrap";

const GroupAdd = React.createClass(
  { mixins: [ History, RouteContext ]

  , propTypes:
    { nextGID: React.PropTypes.number
    , groupForm: React.PropTypes.object.isRequired
    , createGroup: React.PropTypes.func.isRequired
    , updateGroupForm: React.PropTypes.func.isRequired
    , resetGroupForm: React.PropTypes.func.isRequired
    }

  , validateGroup () {
    const nameValid = typeof this.props.groupForm.name === "string"
                        && this.props.groupForm.name !== "";

    var idValid;

    if ( typeof this.props.groupForm.id !== "string"
      || this.props.groupForm.id === ""
       ) {
      idValid = true
    } else {
      let idValue = parseInt( this.props.groupForm.id );
      idValid = Number.isInteger( idValue );
    }

    return nameValid && idValid;
  }

  , cancel: function () {
    this.history.pushState( null, "/accounts/groups" );
  }

  , render: function () {

    let cancelButton =
      <Button
        className = "pull-left"
        onClick = { this.cancel }
        bsStyle = "default"
      >
        { "Cancel" }
      </Button>;

    let resetButton =
      <Button
        className = "pull-left"
        bsStyle = "warning"
        onClick = { this.props.resetGroupForm }
      >
        { "Reset Changes" }
      </Button>;

    let submitGroupButton =
      <Button
        className = "pull-right"
        onClick   = { this.props.createGroup }
        disabled = { !this.validateGroup() }
        bsStyle = "info"
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
            type = "text"
            min = { 1000 }
            label = { "Group ID" }
            value = { typeof this.props.groupForm.id === "string"
                   && this.props.groupForm.id !== ""
                    ? this.props.groupForm.id
                    : null
                    }
            placeholder = { this.props.nextGID }
            onChange = { ( e ) => this.props.updateGroupForm( "id"
                                                            , e.target.value
                                                            )
                       }
          />
        </Col>
        <Col xs = {4}>
          {/* username */}
          <Input
            type = "text"
            label = { "Group Name" }
            value = { this.props.groupForm.name
                   && this.props.groupForm.name !== ""
                    ? this.props.groupForm.name
                    : null
                    }
            onChange = { ( e ) => this.props.updateGroupForm( "name"
                                                            , e.target.value
                                                            )
                       }
            bsStyle = { typeof this.props.groupForm.name === "string"
                     && this.props.groupForm.name !== ""
                      ? null
                      : "error"
                      }
          />
          {/* sudo */ }
        </Col>
        <Col xs = {4}>
          <Input
            type = "checkbox"
            label = "sudo"
            value = { typeof this.props.groupForm === "boolean"
                    ? this.props.groupForm.sudo
                    : null
                    }
            onChange = { ( e ) => this.props.updateGroupForm( "sudo"
                                                            , e.target.checked
                                                            )
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

export default GroupAdd;
