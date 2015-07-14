// Notification Bar
// ================
// Part of the main webapp's window chrome. Positioned at the top of the page,
// this bar details the alerts, events, and tasks that represent the current
// state of the system

"use strict";

import React from "react";
import TWBS from "react-bootstrap";

import MiddlewareClient from "../../middleware/MiddlewareClient";
import SS from "../../stores/SessionStore";
import MS from "../../stores/MiddlewareStore";

import Icon from "../Icon";


var NotificationBar = React.createClass(
  { getInitialState: function () {
    return (
      { visibleLog: ""

      , host        : MS.getHost()
      , protocol    : MS.getProtocol()
      , connected   : MS.getSockState()[0]
      , currentUser : SS.getCurrentUser()

      }
    );
  }

  // TODO: These should use EventBus
  , componentDidMount: function () {
    SS.addChangeListener( this.updateCurrentUser );
    MS.addChangeListener( this.updateHost );
    window.addEventListener( "click", this.makeAllInvisible );
  }

  , componentWillUnmount: function () {
    SS.removeChangeListener( this.updateCurrentUser );
    MS.removeChangeListener( this.updateHost );
    window.removeEventListener( "click", this.makeAllInvisible );
  }

  , updateCurrentUser: function ( event ) {
      this.setState({ currentUser: SS.getCurrentUser() });
    }

  , updateHost: function ( event ) {
      this.setState(
        { host      : MS.getHost()
        , protocol  : MS.getProtocol()
        , connected : MS.getSockState()[0]
        }
      );
    }

  , render: function () {
    return (
      <header className = "app-header notification-bar" >

        <h1 className={ "hostname " + ( this.state.connected
                                      ? "connected"
                                      : "disconnected"
                                      )
                      }
        >
          { this.state.host ? this.state.host : "Disconnected" }
        </h1>

        <div className="user-info">

          <Icon glyph="flag" style={{ color: "#121212" }} />
          <Icon glyph="list-alt" style={{ color: "#121212" }} />

          <TWBS.DropdownButton
            pullRight
            title     = { this.state.currentUser }
            bsStyle   = "link"
            className = "user online"
          >
            <TWBS.MenuItem
              key     = { 0 }
              onClick = { MiddlewareClient.logout.bind( MiddlewareClient ) }
            >
              {"Logout"}
            </TWBS.MenuItem>
          </TWBS.DropdownButton>

        </div>
      </header>
    );
  }
});

export default NotificationBar;
