// DEBUG TOOLS
// ===========
// A simple pane that acts as a companion to the development tools in your
// browser. Offers direct access to the middleware connection FreeNAS is using,
// as well as some debugging helpers.

"use strict";

import React from "react";
import { TabbedArea, TabPane } from "react-bootstrap";

// Events
import EventBus from "../../utility/EventBus";

// Tabs
import RPC from "./DebugTools/RPC";
import Events from "./DebugTools/Events";
import Subscriptions from "./DebugTools/Subscriptions";
import Tasks from "./DebugTools/Tasks";
import Options from "./DebugTools/Options";
// import Terminal from "./DebugTools/Terminal";

// Local variables
var initialPanelHeight;
var initialY;


var DebugTools = React.createClass(

  { getInitialState: function () {
      return { isVisible   : false
             , panelHeight : 350
      };
    }

  , handleResizeStart: function ( event ) {
      event.stopPropagation();
      event.preventDefault();

      initialPanelHeight = this.state.panelHeight;
      initialY           = event.nativeEvent.clientY;

      window.addEventListener( "mouseup", this.handleResizeStop );
      window.addEventListener( "mousemove", this.handleResizeProgress );
    }

  , handleResizeProgress: function ( event, foo ) {
      this.setState({
        panelHeight: initialPanelHeight - ( event.clientY - initialY )
      });
    }

  , handleResizeStop: function ( event ) {
      event.stopPropagation();
      event.preventDefault();

      window.removeEventListener( "mouseup", this.handleResizeStop );
      window.removeEventListener( "mousemove", this.handleResizeProgress );
    }

  , handleKeypress: function ( event ) {
      if ( event.ctrlKey && event.shiftKey && event.which === 192 ) {
        this.toggleVisibility();
      }
    }

  , toggleVisibility: function () {
      if ( this.state.isVisible ) {
        this.setState({ isVisible: false });
      } else {
        this.setState({ isVisible: true });
      }
    }

  , componentDidMount: function () {
      EventBus.on( "toggleDebugTools", this.toggleVisibility );
      window.addEventListener( "keyup", this.handleKeypress );
    }

  , componentWillUnmount: function () {
      EventBus.removeListener( "toggleDebugTools", this.toggleVisibility );
      window.removeEventListener( "keyup", this.handleKeypress );
    }

  , render: function () {
      var content = null;

      if ( this.state.isVisible ) {
        content = (
          <div className = "debug-panel"
               style     = {{ height: this.state.panelHeight + "px" }} >

            <TabbedArea className   = "debug-nav"
                             onMouseDown = { this.handleResizeStart } >

              {/* RPC Interface */}
              <TabPane eventKey={1} tab="RPC">
                <RPC />
              </TabPane>

              {/* Event Log */}
              <TabPane eventKey={2} tab="Events">
                <Events />
              </TabPane>

              {/* Subscriptions List */}
              <TabPane eventKey={3} tab="Subscriptions">
                <Subscriptions />
              </TabPane>

              {/* Task Log and Queue */}
              <TabPane eventKey={4} tab="Tasks">
                <Tasks />
              </TabPane>

              {/* Debugging Options */}
              <TabPane eventKey={6} tab="Options">
                <Options />
              </TabPane>

              {/* Web Console */}
              {/* FIXME: This has bit-rotted to the point of being unusable
              <TabPane eventKey={7} tab="Terminal">
                <Terminal />
              </TabPane>
              */}

            </TabbedArea>

          </div>
        );
      }

      return content;
    }
  }
);

module.exports = DebugTools;
