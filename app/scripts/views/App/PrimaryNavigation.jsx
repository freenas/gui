// PRIMARY NAVIGATION
// ==================
// Left sidebar with navigation links for the primary sections of the FreeNAS 10
// user interface.

"use strict";

import React from "react";
import { connect } from "react-redux";
import { OverlayTrigger, Popover, Input, Nav, MenuItem, NavDropdown
       , DropdownButton, Button }
  from "react-bootstrap";
import { Link } from "react-router";

import MiddlewareClient from "../../websocket/MiddlewareClient";

import ItemIcon from "../../components/items/ItemIcon";
import Icon from "../../components/Icon";

// STYLESHEET
if ( process.env.BROWSER ) require( "./PrimaryNavigation.less" );


// Path definitions
// TODO: Convert to Flux or other external file
const paths =
  [ { path     : "/dashboard"
    , icon     : "icon-datareport"
    , label    : "Dashboard"
    , status   : null
    , disabled : false
    }
  , { path     : "/storage"
    , icon     : "icon-cloud-alt"
    , label    : "Storage"
    , status   : null
    , disabled : false
    }
  , { path     : "/network"
    , icon     : "icon-flowchart"
    , label    : "Network"
    , status   : null
    , disabled : false
    }
  , { path     : "/accounts/users"
    , icon     : "icon-id"
    , label    : "Accounts"
    , status   : null
    , disabled : false
    }
  , { path     : "/calendar"
    , icon     : "icon-calendar"
    , label    : "Calendar"
    , status   : null
    , disabled : false
    }
  , { path     : "/console"
    , icon     : "icon-console"
    , label    : "Console"
    , status   : null
    , disabled : false
    }
  , { path     : "/system"
    , icon     : "icon-drive"
    , label    : "System"
    , status   : null
    , disabled : false
    }
  , { path     : "/settings/system"
    , icon     : "icon-adjust-horiz"
    , label    : "Settings"
    , status   : null
    , disabled : false
    }
  ];

// REACT
class PrimaryNavigation extends React.Component {
  createNavItem ( rawItem, index ) {
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
          <Link
            to = { rawItem.path }
            activeClassName = "active"
          >
            <Icon glyph = { rawItem.icon } />
            <span className = "nav-item-label" >{ rawItem.label }</span>
          </Link>
        </li>
      );
    }
  }

  render () {
    let navClass = [ "primary-nav", "expanded" ];
    let hostDisplay;
    let hostClass = [ "hostname" ];
    let hostValue;
    let activeUser = (
      <div className="user-info">
        <ItemIcon
          primaryString = { this.props.auth.activeUser }
          fallbackString = { this.props.auth.activeUser }
        />
        <span className="username">
          { this.props.auth.activeUser }
        </span>
        <span className="fullname">
          {/* FIXME */}
        </span>
      </div>
    );

    if ( this.props.websocket.readyState === "OPEN" ) {
      if ( this.props.websocket.mode === "SIMULATION_MODE" ) {
        hostDisplay = "Simulation Mode";
        hostValue = "!!SIM";
        hostClass.push( "simulation" );
      } else {
        hostDisplay = this.props.websocket.host;
        hostValue = hostDisplay;
        hostClass.push( "connected" );
      }
    } else {
      hostDisplay = "Disconnected";
      hostValue = "";
      hostClass.push( "disconnected" );
    }

    return (
      <Nav
        stacked
        ref = "navRoot"
        className = { navClass.join( " " ) } >

        <div className={ hostClass.join( " " ) }>
          <div className="logo-wrapper">
            <img className="logo-image" src="/images/freenas-icon.png" />
            <img className="logo-wordmark" src="/images/freenas-logotype.png" />
            <img className="logo-x" src="/images/X.png" />
          </div>

          <span className="host-display">
            { hostDisplay }
          </span>
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

// REDUX
function mapStateToProps ( state ) {
  return (
    { websocket: state.websocket
    , auth: state.auth
    }
  );
}

export default connect( mapStateToProps )( PrimaryNavigation );
