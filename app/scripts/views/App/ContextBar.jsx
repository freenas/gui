// Context Bar
// ===============
// Part of the main webapp's window chrome. Positioned on the right side of the
// page, this bar shows user-customizable content including graphs, logged in
// users, and other widgets.

"use strict";

import React from "react";

import EventBus from "../../utility/EventBus";
import DashboardContext from "../Dashboard/DashboardContext";

// STYLESHEET
if ( process.env.BROWSER ) require( "./ContextBar.less" );


export default class ContextBar extends React.Component {
  constructor ( props ) {
    super( props );
    this.displayName = "Context Sidebar";

    this.onShow = this.showContext.bind( this );
    this.onUpdate = this.updateContext.bind( this );
    this.onHide = this.hideContext.bind( this );

    this.state =
      { activeComponent: DashboardContext
      , activeProps: {}
      , lastComponent: null
      , lastProps: {}
      };
  }

  componentWillMount () {
    EventBus.on( "showContextPanel", this.onShow );
    EventBus.on( "updateContextPanel", this.onUpdate );
    EventBus.on( "hideContextPanel", this.onHide );
  }

  componentWillUnmount () {
    EventBus.removeListener( "showContextPanel", this.onShow );
    EventBus.removeListener( "updateContextPanel", this.onUpdate );
    EventBus.removeListener( "hideContextPanel", this.onHide );
  }

  showContext ( reactElement, props ) {
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

  updateContext ( reactElement, props ) {
    if ( this.state.activeComponent
      && this.state.activeComponent.displayName === reactElement.displayName ) {
      this.setState(
        { activeProps: props
        }
      );
    }
  }

  hideContext ( reactElement ) {
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

  render () {
    let asideClass = [ "app-sidebar" ];
    let activeComponent = null;

    if ( this.state.activeComponent ) {
      activeComponent = (
        <this.state.activeComponent { ...this.state.activeProps } />
      );
    }

    asideClass.push( this.state.activeComponent
                   ? "context-bar-active"
                   : "context-bar-inactive"
                   );

    return (
      <aside className={ asideClass.join( " " ) } >
        { activeComponent }
      </aside>
    );
  }
}
