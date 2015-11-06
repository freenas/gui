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

function staleEventAction ( eventID ) {
  return { type: TYPES.EVENT_IS_STALE, payload: { eventID } };
}

function enqueueStaleEventAction ( eventID ) {
  return { type: TYPES.ENQUEUE_STALE_EVENT, payload: { eventID } };
}

export function systemEvent ( eventData, timestamp ) {
  return ( dispatch, getState ) => {
    const eventID = freeNASUtil.generateUUID();
    const clientTimestamp = moment();
    const data = eventData.args.args;

    let type, text;

    switch ( eventData.args.name ) {
      case "server.client_login":
        type = TYPES.EVENT_CLIENT_LOGIN;
        text = data.description;
        break;

      case "server.client_logout":
        type = TYPES.EVENT_CLIENT_LOGOUT;
        text = data.description;
        break;

      // TODO: Re-enable these when we have a better plan (too much noise)
      // case "system.device.changed":
      //   type = TYPES.EVENT_DEVICE_CHANGED;
      //   text = "Device status changed";
      //   break;

      // case "system.device.detached":
      //   type = TYPES.EVENT_DEVICE_DETACHED;
      //   text = "Device status detached";
      //   break;

      case "system.network.interface.attached":
        type = TYPES.EVENT_INTERFACE_ATTACHED;
        text = "Network interface attached";
        break;

      case "system.network.interface.detached":
        type = TYPES.EVENT_INTERFACE_DETACHED;
        text = "Network interface detached";
        break;

      case "system.network.interface.link_down":
        type = TYPES.EVENT_INTERFACE_LINK_UP;
        text = "Network Interface changed to UP";
        break;

      case "system.network.interface.link_up":
        type = TYPES.EVENT_INTERFACE_LINK_DOWN;
        text = "Network Interface changed to DOWN";
        break;

      case "users.changed":
        type = TYPES.EVENT_USERS_CHANGED;
        text = "User updated";
        break;

      case "groups.changed":
        type = TYPES.EVENT_GROUPS_CHANGED;
        text = "Group updated";
        break;

      case "shares.changed":
        type = TYPES.EVENT_SHARES_CHANGED;
        text = "Share updated";
        break;

      case "update.changed":
        type = TYPES.EVENT_UPDATE_CHANGED;
        text = "Update changed";
        break;

      case "volumes.changed":
        type = TYPES.EVENT_VOLUMES_CHANGED;
        text = "Volume updated";
        break;
    }

    if ( type ) {
      const action =
        { type
        , payload:
          { eventID
          , clientTimestamp
          , text
          , timestamp
          , type
          }
        };

      setTimeout( () => {
        const state = getState();

        if ( state.events.freezeNotifications ) {
          dispatch( enqueueStaleEventAction( eventID ) );
        } else {
          dispatch( staleEventAction( eventID ) );
        }
      }, STALE_AFTER );

      dispatch( action );
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