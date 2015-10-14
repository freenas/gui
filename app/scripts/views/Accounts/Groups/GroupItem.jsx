// Group Item Template
// ==================
// Handles the modes for viewing and editing a group. Controls props and which
// mode is active.


"use strict";

import _ from "lodash";
import React from "react";

import routerShim from "../../../mixins/routerShim";
import clientStatus from "../../../mixins/clientStatus";

import editorUtil from "../../../components/Viewer/Editor/editorUtil";

import GroupsMiddleware from "../../../flux/middleware/GroupsMiddleware";
import GroupsStore from "../../../flux/stores/GroupsStore";

import UsersStore from "../../../flux/stores/UsersStore";

import groupMixins from "../../../mixins/groupMixins";
import inputHelpers from "../../../mixins/inputHelpers";

import GroupView from "./GroupView";
import GroupEdit from "./GroupEdit";

// CONTROLLER-VIEW
const GroupItem = React.createClass({

  mixins: [ routerShim, clientStatus ]

  , getInitialState: function () {
    return { targetGroup : this.getGroupFromStore()
           , currentMode : "view"
           , activeRoute : this.getDynamicRoute()
           };
  }

  , componentDidUpdate: function ( prevProps, prevState ) {
    var activeRoute = this.getDynamicRoute();

    if ( activeRoute !== prevState.activeRoute ) {
      this.setState(
        { targetGroup  : this.getGroupFromStore()
        , currentMode : "view"
        , activeRoute : activeRoute
        }
      );
    }
  }

  , componentDidMount: function () {
    GroupsStore.addChangeListener( this.updateGroupInState );
  }

  , componentWillUnmount: function () {
    GroupsStore.removeChangeListener( this.updateGroupInState );
  }

  , getGroupFromStore: function () {
    return GroupsStore.findGroupByKeyValue( this.props.keyUnique
                                          , this.getDynamicRoute()
                                          );
  }

  , updateGroupInState: function () {
    this.setState({ targetGroup: this.getGroupFromStore() });
  }

  , handleViewChange: function ( nextMode, event ) {
    this.setState({ currentMode: nextMode });
  }

  , render: function () {
    var DisplayComponent = null;
    var processingText = "";

    if ( this.state.SESSION_AUTHENTICATED && this.state.targetGroup ) {

      // DISPLAY COMPONENT
      let childProps = { handleViewChange : this.handleViewChange
                       , item             : this.state.targetGroup
                       , itemLabels       : this.props.itemLabels
                       , nextGID          : this.props.nextGID
                       };

      switch ( this.state.currentMode ) {
        default:
        case "view":
          DisplayComponent = <GroupView { ...childProps } />;
          break;
        case "edit":
          DisplayComponent = <GroupEdit { ...childProps } />;
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
