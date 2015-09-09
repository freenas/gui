// USER VIEW TEMPLATE
// ==================
// The initial view of a user, showing up-front information and status.

"use strict";

import _ from "lodash";
import React from "react";
import { ListGroupItem, Alert, ButtonToolbar, Button, Grid, Row, Col
       , ListGroup
       }
  from "react-bootstrap";

import userMixins from "../../../mixins/userMixins";

import viewerUtil from "../../../components/Viewer/viewerUtil";

import GroupsStore from "../../../../flux/stores/GroupsStore";

const UserView = React.createClass(
  { mixins: [ userMixins ]

  , propTypes: { item: React.PropTypes.object.isRequired }

  , getGroupName: function ( groupID ) {
      var group = GroupsStore.getGroup( groupID );

      if ( group ) {
        return group[ "name" ];
      } else {
        // TODO: Have a policy to deal with a user assigned to a
        // nonexistant group.
        return null;
      }
    }

  , createGroupDisplayList: function () {
      var listGroupItemArray = [] ;

      listGroupItemArray = _.map( this.props.item[ "groups" ]
                                 , function ( groupID ) {
        var displayItem = null;
        var group = GroupsStore.getGroup( groupID );

        if ( group ) {
          displayItem = <ListGroupItem>{ group["name"] }
            </ListGroupItem>;
        }

        return displayItem;
      }, this );

      return listGroupItemArray;
    }

  , render: function () {
      var builtInUserAlert = null;
      var loggedInUserAlert = null;
      var editButtons      = null;

      if ( this.props.item["builtin"] ) {
        builtInUserAlert = (
          <Alert bsStyle   = "info"
                      className = "text-center">
            <b>{"This is a built-in FreeNAS user account."}</b>
          </Alert>
        );
      }

      if ( this.props.item["logged-in"] ) {
        loggedInUserAlert = (
          <Alert bsStyle   = "info"
                      className = "text-center">
            <b>{"This user is currently logged in."}</b>
          </Alert>
        );
      }

      editButtons = (
        <ButtonToolbar>
            <Button className = "pull-left"
                         disabled  = { this.props.item["builtin"] }
                         onClick   = { this.deleteUser }
                         bsStyle   = "danger" >{"Delete User"}</Button>
            <Button className = "pull-right"
                         onClick   = { this.props.handleViewChange.bind( null, "edit" ) }
                         bsStyle   = "info" >{"Edit User"}</Button>
        </ButtonToolbar>
      );

      return (
        <Grid fluid>
          {/* "Edit User" Button - Top */}
          { editButtons }

          {/* User icon and general information */}
          <Row>
            <Col xs={3}
                      className="text-center">
              <viewerUtil.ItemIcon primaryString   = { this.props.item["full_name"] }
                                   fallbackString  = { this.props.item["username"] }
                                   iconImage       = { this.props.item["user_icon"] }
                                   seedNumber      = { this.props.item["id"] } />
            </Col>
            <Col xs={9}>
              <h3>{ this.props.item["username"] }</h3>
              <h4 className="text-muted">{ viewerUtil.writeString( this.props.item["full_name"], "\u200B" ) }</h4>
              <h4 className="text-muted">{ viewerUtil.writeString( this.props.item["email"], "\u200B" ) }</h4>
              <hr />
            </Col>
          </Row>

          {/* Shows a warning if the user account is built in */}
          { builtInUserAlert }

          {/* Primary user data overview */}
          <Row>
            <viewerUtil.DataCell title  = { "User ID" }
                                 colNum = { 3 }
                                 entry  = { this.props.item["id"] } />
            <viewerUtil.DataCell title  = { "Primary Group" }
                                 colNum = { 3 }
                                 entry  = { this.getGroupName( this.props.item["group"] ) } />
            <viewerUtil.DataCell title  = { "Shell" }
                                 colNum = { 3 }
                                 entry  = { this.props.item["shell"] } />
            <viewerUtil.DataCell title  = { "Locked Account" }
                                 colNum = { 3 }
                                 entry  = { this.props.item["locked"] ? this.props.item["locked"] : false } />
            <viewerUtil.DataCell title  = { "Sudo Access" }
                                 colNum = { 3 }
                                 entry  = { this.props.item["sudo"] ? this.props.item["sudo"]: false } />
            <viewerUtil.DataCell title  = { "Password Disabled" }
                                 colNum = { 3 }
                                 entry  = { this.props.item["password_disabled"] ? this.props.item["password_disabled"]: false } />
            <viewerUtil.DataCell title  = { "Home Directory" }
                                 colNum = { 3 }
                                 entry  = { this.props.item["home"] } />
            <viewerUtil.DataCell title  = { "email" }
                                 colNum = { 3 }
                                 entry  = { this.props.item["email"] ? this.props.item["email"]: "" } />
            <Col
              xs = {12}
              className ="text-muted"
            >
              <h4 className = "text-muted" >{ "Other Groups" }</h4>
              <ListGroup>
                { this.createGroupDisplayList() }
              </ListGroup>
            </Col>
          </Row>

          { loggedInUserAlert }

        </Grid>
      );
    }
  }
);

export default UserView;
