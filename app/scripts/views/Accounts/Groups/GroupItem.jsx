// Group Item Template
// ==================
// Handles the modes for viewing and editing a group. Controls props and which
// mode is active.


"use strict";

import _ from "lodash";
import React from "react";
import { Alert, Grid } from "react-bootstrap";
import Throbber from "../../../components/Throbber";

import GroupView from "./GroupView";
import GroupEdit from "./GroupEdit";

// CONTROLLER-VIEW
const GroupItem = React.createClass(
  { propTypes: { keyUnique: React.PropTypes.string
               , params: React.PropTypes.object
               , routeParam: React.PropTypes.string
               }

  , getInitialState: function () {
    return { currentMode : "view" };
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
      && this.props.users
      && Array.isArray( this.props.itemData )
      && Array.isArray( this.props.users )
      && this.props.itemData.length
      && this.props.users.length
       ) {
      const item = this.props.itemData.find(
                     function findSelectedGroup ( group ) {
                       return group[ this.props.keyUnique ]
                          === this.props.params[ this.props.routeParam ];
                   }
                   , this
                   );

      if ( this.props.params[ this.props.routeParam ] ) {

        switch ( this.state.currentMode ) {
          default:
          case "view":
            DisplayComponent = <GroupView
                                 handleViewChange = { this.handleViewChange }
                                 item = { item }
                                 { ...this.props }
                               />;
            break;
          case "edit":
            DisplayComponent = <GroupEdit
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
    // Check if users or groups are loading before trying to render group
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

export default GroupItem;
