// Group Item Template
// ==================
// Handles the modes for viewing and editing a group. Controls props and which
// mode is active.


"use strict";

import _ from "lodash";
import React from "react";

import editorUtil from "../../../components/Viewer/Editor/editorUtil";

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
    if ( activeRoute !== prevState.activeRoute ) {
      this.setState(
        { currentMode : "view" }
      );
    }
  }

  , handleViewChange: function ( nextMode, event ) {
    this.setState({ currentMode: nextMode });
  }

  , render: function () {
    var DisplayComponent = null;
    var processingText = "";
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

        { /* Overlay to block interaction
          /*while tasks or updates are processing */ }
        <editorUtil.updateOverlay updateString={ processingText } />

        { DisplayComponent }

      </div>
    );
  }
});

export default GroupItem;
