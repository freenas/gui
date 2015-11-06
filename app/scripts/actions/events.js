// EVENTS - ACTION CREATORS
// ========================

"use strict";

import moment from "moment";

import * as TYPES from "./actionTypes";
import freeNASUtil from "../utility/freeNASUtil";

// An event will be considered "stale" after this much time has elapsed
const STALE_AFTER = 10000;
// This delay ensures that moving focus away from the notifications will not
// cause them to instantly disappear, and gives the user time to re-enter the
// element and re-freeze the events
const UNFREEZE_AFTER = 5000;

function eventAction ( type, data, timestamp ) {
  const eventID = freeNASUtil.generateUUID();
  const clientTimestamp = moment();

  return { type, payload: { data, timestamp, eventID, clientTimestamp } };
}

function staleEventAction ( eventID ) {
  return { type: TYPES.EVENT_IS_STALE, payload: { eventID } };
}

function enqueueStaleEventAction ( eventID ) {
  return { type: TYPES.ENQUEUE_STALE_EVENT, payload: { eventID } };
}

export function systemEvent ( data, timestamp ) {
  return ( dispatch, getState ) => {
    const NAME = data.args.name;
    let action;

    switch ( NAME ) {
      case "server.client_login":
        action = eventAction( TYPES.EVENT_CLIENT_LOGIN, data, timestamp );
        break;

      case "server.client_logout":
        action = eventAction( TYPES.EVENT_CLIENT_LOGOUT, data, timestamp );
        break;

      // TODO: Re-enable these when we have a better plan (too much noise)
      // case "system.device.changed":
      //   action = eventAction( TYPES.EVENT_DEVICE_CHANGED, data, timestamp );
      //   break;

      // case "system.device.detached":
      //   action = eventAction( TYPES.EVENT_DEVICE_DETACHED, data, timestamp );
      //   break;

      case "system.network.interface.attached":
        action = eventAction( TYPES.EVENT_INTERFACE_ATTACHED, data, timestamp );
        break;

      case "system.network.interface.detached":
        action = eventAction( TYPES.EVENT_INTERFACE_DETACHED, data, timestamp );
        break;

      case "system.network.interface.link_down":
        action = eventAction( TYPES.EVENT_INTERFACE_LINK_UP, data, timestamp );
        break;

      case "system.network.interface.link_up":
        action = eventAction( TYPES.EVENT_INTERFACE_LINK_DOWN, data, timestamp );
        break;

      case "users.changed":
        action = eventAction( TYPES.EVENT_USERS_CHANGED, data, timestamp );
        break;

      case "groups.changed":
        action = eventAction( TYPES.EVENT_GROUPS_CHANGED, data, timestamp );
        break;

      case "shares.changed":
        action = eventAction( TYPES.EVENT_SHARES_CHANGED, data, timestamp );
        break;

      case "update.changed":
        action = eventAction( TYPES.EVENT_UPDATE_CHANGED, data, timestamp );
        break;

      case "volumes.changed":
        action = eventAction( TYPES.EVENT_VOLUMES_CHANGED, data, timestamp );
        break;
    }

    if ( action ) {
      dispatch( action );
      setTimeout( () => {
        const state = getState();

        if ( state.events.freezeNotifications ) {
          dispatch( enqueueStaleEventAction( action.payload.eventID ) );
        } else {
          dispatch( staleEventAction( action.payload.eventID ) );
        }
      }, STALE_AFTER );
    }
  }
}


export function freezeNotifications () {
  return { type: TYPES.FREEZE_NOTIFICATIONS }
}

export function unfreezeNotifications () {
  return ( dispatch, getState ) => {
    const before = getState();

    setTimeout( () => {
      const after = getState();

      if ( before.events.frozenAt
        && before.events.frozenAt.isSame( after.events.frozenAt ) ) {
        dispatch( { type: TYPES.UNFREEZE_NOTIFICATIONS });
        dispatch( { type: TYPES.DEQUEUE_STALE_EVENTS });
      }
    }, UNFREEZE_AFTER );
  }
}