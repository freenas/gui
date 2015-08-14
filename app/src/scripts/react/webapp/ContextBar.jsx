// Context Bar
// ===============
// Part of the main webapp's window chrome. Positioned on the right side of the
// page, this bar shows user-customizable content including graphs, logged in
// users, and other widgets.

"use strict";

import _ from "lodash";
import React from "react";
import TWBS from "react-bootstrap";

import EventBus from "../../utility/EventBus";

const ContextBar = React.createClass(

  { displayName: "Context Sidebar"

  , componentWillMount: function () {
    EventBus.on( "showContextPanel", this.showContext );
    EventBus.on( "updateContextPanel", this.updateContext );
    EventBus.on( "hideContextPanel", this.hideContext );
  }

  , componentWillUnmount: function () {
    EventBus.removeListener( "showContextPanel", this.showContext );
    EventBus.removeListener( "updateContextPanel", this.updateContext );
    EventBus.removeListener( "hideContextPanel", this.hideContext );
  }

  , getInitialState: function () {
    return { activeComponent: null
           , activeProps: {}
           , lastComponent: null
           , lastProps: {}
           };
  }

  , showContext: function ( reactElement, props ) {
    if ( reactElement.displayName ) {
      this.setState(
        { activeComponent: reactElement
        , activeProps: props
        , lastComponent: this.state.activeComponent
        , lastProps: this.state.activeProps
        }
      );
    } else {
      console.warn( "Invalid React element passed to " + this.displayName );
      console.dir( reactElement );
    }
  }

  , updateContext ( reactElement, props ) {
      if ( this.state.activeComponent
        && this.state.activeComponent.displayName === reactElement.displayName ) {
        this.setState(
          { activeProps: props
          }
        );
      }
    }

  , hideContext: function ( reactElement ) {
      if ( this.state.activeComponent
        && this.state.activeComponent.displayName === reactElement.displayName ) {
        this.setState(
          { activeComponent : this.state.lastComponent
          , activeProps: this.state.lastProps
          , lastComponent: null
          , lastProps: {}
          }
        );
      }
    }

  , render: function () {
    let activeComponent = null;

    if ( this.state.activeComponent ) {
      activeComponent = (
        <this.state.activeComponent { ...this.state.activeProps } />
      );
    }

    return (
      <aside
        className = { "app-sidebar" + this.state.activeComponent
                                    ? " context-bar-active"
                                    : " context-bar-inactive"
                    }
      >
        { activeComponent }
      </aside>
    );
  }
});

export default ContextBar;
