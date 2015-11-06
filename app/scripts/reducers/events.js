// EVENTS - REDUCER
// ================

"use strict";

import * as TYPES from "../actions/actionTypes";

const INITIAL_STATE =
  { events: {}
  , timeline: []
  , freezeToasts: false
  };


export default function events ( state = INITIAL_STATE, action ) {
  const { payload, error, type } = action;

  switch( type ) {
    case TYPES.EVENT_CLIENT_LOGIN:
    case TYPES.EVENT_CLIENT_LOGOUT:
    // TODO: Too much noise from these two
    // case TYPES.EVENT_DEVICE_CHANGED:
    // case TYPES.EVENT_DEVICE_DETACHED:
    case TYPES.EVENT_INTERFACE_ATTACHED:
    case TYPES.EVENT_INTERFACE_DETACHED:
    case TYPES.EVENT_INTERFACE_LINK_UP:
    case TYPES.EVENT_INTERFACE_LINK_DOWN:
    case TYPES.EVENT_USERS_CHANGED:
    case TYPES.EVENT_GROUPS_CHANGED:
    case TYPES.EVENT_SHARES_CHANGED:
    case TYPES.EVENT_UPDATE_CHANGED:
    case TYPES.EVENT_VOLUMES_CHANGED:
      var events = Object.assign( {}, state.events );
      var timeline = state.timeline.slice( 0 );

      events[ payload.eventID ] =
        { ...payload.data.args
        , type
        , clientTimestamp: payload.clientTimestamp
        };

      timeline.unshift( payload.eventID );

      return Object.assign( {}, state, { events, timeline } );

    default:
      return state;
  }
}
