// User Item Template
// ==================
// Handles the viewing and editing of individual user items. Shows a non-editable
// overview of the user account, and mode-switches to a more standard editor
// panel. User is set by providing a route parameter.

"use strict";

import _ from "lodash";
import React from "react";
import { Alert, Grid } from "react-bootstrap";
import Throbber from "../../../components/Throbber";

import UserView from "./UserView";
import UserEdit from "./UserEdit";

// CONTROLLER-VIEW
const UserItem = React.createClass(
  { propTypes: { keyUnique: React.PropTypes.string
               , params: React.PropTypes.object
               , routeParam: React.PropTypes.string
               }

  , getInitialState: function () {
      return (
        { currentMode : "view" }
      );
    }

  , componentDidUpdate: function ( prevProps, prevState ) {
      if ( prevProps.params[ this.props.routeParam ]
       !== this.props.params[ this.props.routeParam ]
         ) {
        this.setState( { currentMode : "view" } );
      }
    }

  , handleViewChange: function ( nextMode, event ) {
      this.setState({ currentMode: nextMode });
    }

  , render: function () {
      var DisplayComponent = null;
      if ( this.props.itemData
        && this.props.groups
        && Array.isArray( this.props.itemData )
        && Array.isArray( this.props.groups )
        && this.props.itemData.length
        && this.props.groups.length
         ) {
        const item = this.props.itemData.find(
                     function findSelectedUser ( user ) {
                       return user[ this.props.keyUnique ]
                          === this.props.params[ this.props.routeParam ];
                  }
                  , this
                  );

        if ( this.props.params[ this.props.routeParam ] ) {

          // DISPLAY COMPONENT
          switch ( this.state.currentMode ) {
            default:
            case "view":
              DisplayComponent = <UserView
                                   handleViewChange = { this.handleViewChange }
                                   item = { item }
                                   { ...this.props }
                                 />;
              break;

            case "edit":
              DisplayComponent = <UserEdit
                                   handleViewChange = { this.handleViewChange }
                                   item = { item }
                                   { ...this.props }
                                 />;
              break;
          }
        }

        return (
          <div className="viewer-item-info">
            { DisplayComponent }
          </div>
        );
      // Check if users or groups are loading before trying to render user
      } else if ( ( Array.isArray( this.props.users ) // should always pass
                   && this.props.users.length === 0
                    )
                || ( Array.isArray( this.props.groups ) // should always pass
                   && this.props.groups.length === 0
                    )
                  ) {
        return (
          <Grid>
            <Throbber
              className = "center"
              size = { 300 }
            />
          </Grid>
        );
      } else {
        return (
          <Grid>
            <Alert
              bsStyle = "info"
              className = "text-center"
            >
              <b>{ "This user does not exist." }</b>
            </Alert>
          </Grid>
        );
      }
    }
});

export default UserItem;
