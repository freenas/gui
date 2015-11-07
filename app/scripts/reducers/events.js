// EVENTS - REDUCER
// ================

"use strict";

import moment from "moment";

import * as TYPES from "../actions/actionTypes";

const INITIAL_STATE =
  { events: {}
  , timeline: []
  , freezeNotifications: false
  , frozenAt: null
  , willBeStale: new Set()
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

      events[ payload.eventID ] = { ...payload, isStale: false };

      timeline.unshift( payload.eventID );

      return Object.assign( {}, state, { events, timeline } );

    case TYPES.FREEZE_NOTIFICATIONS:
      return Object.assign( {}, state,
        { freezeNotifications: true
        , frozenAt: moment()
        }
      );

    case TYPES.UNFREEZE_NOTIFICATIONS:
      return Object.assign( {}, state,
        { freezeNotifications: false
        , frozenAt: null
        }
      );

    case TYPES.ENQUEUE_STALE_EVENT:
      var willBeStale = new Set( state.willBeStale );

      willBeStale.add( payload.eventID );
      return Object.assign( {}, state, { willBeStale } );

    case TYPES.DEQUEUE_STALE_EVENTS:
      var willBeStale = new Set();
      var events = Object.assign( {}, state.events );

      Array.from( state.willBeStale ).forEach( id => {
        if ( events.hasOwnProperty( id ) ) {
          events[ id ].isStale = true;
        } else {
          console.warn( `Event with id "${ id }" not found, will try again.`
                      , events
                      );
          willBeStale.add( id );
        }
      });
      return Object.assign( {}, state, { willBeStale, events } );

    case TYPES.EVENT_IS_STALE:
      var willBeStale = new Set( state.willBeStale );
      var events = Object.assign( {}, state.events );

      if ( events.hasOwnProperty( payload.eventID ) ) {
        events[ payload.eventID ].isStale = true;
      }
      willBeStale.delete( payload.eventID );

      return Object.assign( {}, state, { willBeStale, events } );

    default:
      return state;
  }
}
