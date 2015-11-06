// EVENTS
// ======
// Controller component for rendering toast notifications

"use strict";

import _ from "lodash";
import moment from "moment";
import React from "react";
import { connect } from "react-redux";
import { VelocityTransitionGroup } from "velocity-react";

import * as TYPES from "../../actions/actionTypes";
import * as EVENTS from "../../actions/events";

import Notification from "./Events/Notification";


// STYLESHEET
if ( process.env.BROWSER ) require( "./Events.less" );


// REACT
class Events extends React.Component {
  renderEvents ( event, index ) {
    let text;

    switch ( event.type ) {
      case TYPES.EVENT_CLIENT_LOGIN:
        text = event.args.description;
        break;

      case TYPES.EVENT_CLIENT_LOGOUT:
        text = event.args.description;
        break;

      case TYPES.EVENT_DEVICE_CHANGED:
        text = "Device status changed";
        break;

      case TYPES.EVENT_DEVICE_DETACHED:
        text = "Device detached";
        break;

      case TYPES.EVENT_INTERFACE_ATTACHED:
        text = "Network interface attached";
        break;

      case TYPES.EVENT_INTERFACE_DETACHED:
        text = "Network interface detached";
        break;

      case TYPES.EVENT_INTERFACE_LINK_UP:
        text = "Network Interface changed to UP";
        break;

      case TYPES.EVENT_INTERFACE_LINK_DOWN:
        text = "Network Interface changed to DOWN";
        break;

      case TYPES.EVENT_USERS_CHANGED:
        text = "User updated";
        break;

      case TYPES.EVENT_GROUPS_CHANGED:
        text = "Group updated";
        break;

      case TYPES.EVENT_SHARES_CHANGED:
        text = "Share updated";
        break;

      case TYPES.EVENT_UPDATE_CHANGED:
        text = "Update changed";
        break;

      case TYPES.EVENT_VOLUMES_CHANGED:
        text = "Volume updated";
        break;
    }

    if ( text ) {
      return (
        <Notification
          key = { index }
          text = { text }
          clientTimestamp = { event.clientTimestamp }
        />
      );
    } else {
      console.warn( "Unrecognized or unsupported event:", event );
      return <noscript key={ index } />;
    }
  }

  render () {
    const TIMELINE = this.props.events.timeline;
    const EVENTS = this.props.events.events;
    const TO_RENDER = [];

    for ( let i = 0; i < TIMELINE.length; i++ ) {
      if ( EVENTS[ TIMELINE[i] ] && !EVENTS[ TIMELINE[i] ].isStale ) {
        console.log( EVENTS[ TIMELINE[i] ] );
        TO_RENDER.push( EVENTS[ TIMELINE[i] ] );
      } else {
        break;
      }
    }

    return (
      <div
        className = "notification-feed"
        onMouseEnter = { () => this.props.freezeNotifications() }
        onMouseLeave = { () => this.props.unfreezeNotifications() }
      >
        { TO_RENDER.map( ( event, index ) =>
          this.renderEvents( event, index )
        )}
      </div>
    );
  }
}


// REDUX
function mapStateToProps ( state ) {
  return (
    { events: state.events
    }
  );
}

function mapDispatchToProps ( dispatch ) {
  return (
    { freezeNotifications: () =>
      dispatch( EVENTS.freezeNotifications() )
    , unfreezeNotifications: () =>
      dispatch( EVENTS.unfreezeNotifications() )
    }
  );
}

export default connect( mapStateToProps, mapDispatchToProps )( Events );
