// DEBUG TOOLS
// ===========
// A simple pane that acts as a companion to the development tools in your
// browser. Offers direct access to the middleware connection FreeNAS is using,
// as well as some debugging helpers.

"use strict";

import React from "react";
import { Tabs, Tab } from "react-bootstrap";

// Events
import EventBus from "../../utility/EventBus";

// Tabs
import RPC from "./DebugTools/RPC";
import Events from "./DebugTools/Events";
import Subscriptions from "./DebugTools/Subscriptions";
import Tasks from "./DebugTools/Tasks";
import Options from "./DebugTools/Options";

// STYLESHEET
if ( process.env.BROWSER ) require( "./DebugTools.less" );


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

            <Tabs
              className = "debug-nav"
              onMouseDown = { this.handleResizeStart }
            >

              {/* RPC Interface */}
              <Tab eventKey={1} title="RPC">
                <RPC />
              </Tab>

              {/* Event Log */}
              <Tab eventKey={2} title="Events">
                <Events />
              </Tab>

              {/* Subscriptions List */}
              <Tab eventKey={3} title="Subscriptions">
                <Subscriptions />
              </Tab>

              {/* Task Log and Queue */}
              <Tab eventKey={4} title="Tasks">
                <Tasks />
              </Tab>

              {/* Debugging Options */}
              <Tab eventKey={6} title="Options">
                <Options />
              </Tab>

            </Tabs>

          </div>
        );
      }

      return content;
    }
  }
);

module.exports = DebugTools;
