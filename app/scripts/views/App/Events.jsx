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

import Notification from "./Events/Notification";


// STYLESHEET
if ( process.env.BROWSER ) require( "./Events.less" );


// REACT
class Events extends React.Component {
  renderEvents ( id, index ) {
    const EVENT = this.props.events.events[ id ];
    let text;

    if ( !EVENT ) {
      console.warn( `Event "${ id }" does not exist in events:`, this.props.events );
      return <noscript />;
    }

    switch ( EVENT.type ) {
      case TYPES.EVENT_CLIENT_LOGIN:
        text = EVENT.args.description;
        break;

      case TYPES.EVENT_CLIENT_LOGOUT:
        text = EVENT.args.description;
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
          clientTimestamp = { EVENT.clientTimestamp }
        />
      );
    } else {
      console.warn( "Unrecognized or unsupported event:", EVENT );
      return <noscript key={ index } />;
    }
  }

  render () {
    return (
      <div className="notification-feed">
        { this.props.events.timeline.map( ( id, index ) =>
          this.renderEvents( id, index )
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
  return {}
}

export default connect( mapStateToProps, mapDispatchToProps )( Events );
