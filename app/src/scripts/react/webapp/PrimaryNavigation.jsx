// PRIMARY NAVIGATION
// ==================
// Left sidebar with navigation links for the primary sections of the FreeNAS 10
// user interface.

"use strict";

import React from "react";
import { OverlayTrigger, Popover, Input, Nav, MenuItem, NavDropdown
       , DropdownButton, Button }
  from "react-bootstrap";
import { Link } from "react-router";

import MiddlewareClient from "../../websocket/MiddlewareClient";
import SS from "../../flux/stores/SessionStore";
import MS from "../../flux/stores/MiddlewareStore";

import ItemIcon from "../components/items/ItemIcon";
import Icon from "../components/Icon";


// Path definitions
// TODO: Convert to Flux or other external file
const paths =
  [ { path     : "dashboard"
    , icon     : "icon-datareport"
    , label    : "Dashboard"
    , status   : null
    , disabled : false
    }
  , { path     : "storage"
    , icon     : "icon-cloud-alt"
    , label    : "Storage"
    , status   : null
    , disabled : false
    }
  , { path     : "network"
    , icon     : "icon-flowchart"
    , label    : "Network"
    , status   : null
    , disabled : false
    }
  , { path     : "accounts"
    , icon     : "icon-id"
    , label    : "Accounts"
    , status   : null
    , disabled : false
    }
  , { path     : "calendar"
    , icon     : "icon-calendar"
    , label    : "Calendar"
    , status   : null
    , disabled : false
    }
  , { path     : "console"
    , icon     : "icon-console"
    , label    : "Console"
    , status   : null
    , disabled : false
    }
  , { path     : "hardware"
    , icon     : "icon-drive"
    , label    : "Hardware"
    , status   : null
    , disabled : false
    }
  , { path     : "settings"
    , icon     : "icon-adjust-horiz"
    , label    : "Settings"
    , status   : null
    , disabled : false
    }
  ];

const menuTiming = 600;

const PrimaryNavigation = React.createClass(

  { getInitialState () {
      return (
        { host: MS.host
        , userHost: null
        , protocol: MS.protocol
        , mode: MS.mode
        , connected: MS.connected
        , currentUser: SS.getCurrentUser()
        }
      );
    }

  , componentDidMount () {
      SS.addChangeListener( this.updateCurrentUser );
      MS.addChangeListener( this.updateHost );
      // After the component has a real DOM representation, store the auto width
      // value of the navbar
      this.setState(
        { fullNavWidth: this.refs.navRoot.getDOMNode().offsetWidth + "px" }
      );
    }

  , componentWillUnmount () {
      SS.removeChangeListener( this.updateCurrentUser );
      MS.removeChangeListener( this.updateHost );
    }

  , updateCurrentUser ( event ) {
      this.setState({ currentUser: SS.getCurrentUser() });
    }

  , updateHost ( event ) {
      this.setState(
        { host: MS.host
        , protocol: MS.protocol
        , mode: MS.mode
        , connected: MS.connected
        }
      );
    }

  , resetHostInput ( event ) {
      this.setState({ userHost: null });
    }

  , updateHostInput ( event ) {
      this.setState({ userHost: event.target.value });
    }

  , handleHostKeyDown ( event ) {
      if ( event.which === 13 ) { this.changeConnection(); }
    }

  , changeConnection ( event ) {
      // HACK: I wish react-bootstap's "show" prop worked for the OverlayTrigger
      document.body.click();

      MiddlewareClient.logout();
      this.resetHostInput();
    }

  , createNavItem ( rawItem, index ) {
      if ( rawItem.disabled ) {
        return (
          <li
            role = "presentation"
            className = "nav-item disabled"
            key = { index } >
            <a href = "#">
              <Icon glyph = { rawItem.icon } />
              <span className = "nav-item-label" >{ rawItem.label }</span>
            </a>
          </li>
        );
      } else {
        return (
          <li
            role = "presentation"
            className = "nav-item"
            key = { index } >
            <Link to = { rawItem.path } >
              <Icon glyph = { rawItem.icon } />
              <span className = "nav-item-label" >{ rawItem.label }</span>
            </Link>
          </li>
        );
      }
    }

  , render () {
      let navClass = [ "primary-nav", "expanded" ];
      let hostDisplay;
      let hostClass = [ "hostname" ];
      let hostValue;
      let activeUser = (
        <div className="user-info">
          <ItemIcon
            primaryString = "Foo"
            fallbackString = { this.state.currentUser }
          />
          <span className="username">
            { this.state.currentUser }
          </span>
          <span className="fullname">
            { "Full Name" }
          </span>
        </div>
      );

      if ( this.state.host ) {
        if ( this.state.mode === "SIMULATION_MODE" ) {
          hostDisplay = "Simulation Mode";
          hostValue = "!!SIM";
          hostClass.push( "simulation" );
        } else {
          hostDisplay = this.state.host;
          hostValue = hostDisplay;
          hostClass.push( "connected" );
        }
      } else {
        hostDisplay = "Disconnected";
        hostValue = "";
        hostClass.push( "disconnected" );
      }

      if ( typeof this.state.userHost === "string" ) {
        hostValue = this.state.userHost
      }

      let connectionPopover = (
        <Popover
          id = "host-connection-input"
        >
          <Input
            ref = "connectionInput"
            type = "text"
            label = "Connect to FreeNAS Host"
            value = { hostValue }
            placeholder = "Hostname or IP"
            onKeyDown = { this.handleHostKeyDown }
            onChange = { this.updateHostInput }
            buttonAfter = {
                <Button
                  bsStyle = "primary"
                  onClick = { this.changeConnection }
                >
                  {"Go"}
                </Button>
              }
          />
        </Popover>
      );

      return (
        <Nav
          stacked
          ref = "navRoot"
          className = { navClass.join( " " ) } >

          <div className={ hostClass.join( " " ) }>
            <div className="logo-wrapper">
              <img
                className = "logo-image"
                src = "/images/freenas-icon.png"
              />
              <img
                className = "logo-wordmark"
                src = "/images/freenas-logotype.png"
              />
              <img
                className = "logo-x"
                src = "/images/X.png"
              />
            </div>

            <OverlayTrigger
              rootClose
              trigger = "click"
              placement = "bottom"
              onExited = { this.resetHostInput }
              overlay = { connectionPopover }
            >
              <span
                role = "button"
                className = "host-display"
              >
                { hostDisplay }
              </span>
            </OverlayTrigger>

          </div>

          <NavDropdown
            id = "active-user-controls"
            title = { activeUser }
          >
            <MenuItem
              key     = { 0 }
              onSelect = { MiddlewareClient.logout.bind( MiddlewareClient ) }
            >
              {"Logout"}
            </MenuItem>
          </NavDropdown>

          { paths.map( this.createNavItem ) }

        </Nav>
      );
    }

  }
);

export default PrimaryNavigation;
