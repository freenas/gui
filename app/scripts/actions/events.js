// EVENTS - ACTION CREATORS
// ========================

"use strict";

import * as TYPES from "./actionTypes";
import freeNASUtil from "../utility/freeNASUtil";
import moment from "moment";

function eventAction ( type, data, timestamp ) {
  const eventID = freeNASUtil.generateUUID();
  const clientTimestamp = moment();

  return { type, payload: { data, timestamp, eventID, clientTimestamp } };
}

export function systemEvent ( data, timestamp ) {
  return ( dispatch, getState ) => {
    const NAME = data.args.name;

    switch ( NAME ) {
      case "server.client_login":
        dispatch( eventAction( TYPES.EVENT_CLIENT_LOGIN, data, timestamp ) );
        break;

      case "server.client_logout":
        dispatch( eventAction( TYPES.EVENT_CLIENT_LOGOUT, data, timestamp ) );
        break;

      // TODO: Re-enable these when we have a better plan (too much noise)
      // case "system.device.changed":
      //   dispatch( eventAction( TYPES.EVENT_DEVICE_CHANGED, data, timestamp ) );
      //   break;

      // case "system.device.detached":
      //   dispatch( eventAction( TYPES.EVENT_DEVICE_DETACHED, data, timestamp ) );
      //   break;

      case "system.network.interface.attached":
        dispatch( eventAction( TYPES.EVENT_INTERFACE_ATTACHED, data, timestamp ) );
        break;

      case "system.network.interface.detached":
        dispatch( eventAction( TYPES.EVENT_INTERFACE_DETACHED, data, timestamp ) );
        break;

      case "system.network.interface.link_down":
        dispatch( eventAction( TYPES.EVENT_INTERFACE_LINK_UP, data, timestamp ) );
        break;

      case "system.network.interface.link_up":
        dispatch( eventAction( TYPES.EVENT_INTERFACE_LINK_DOWN, data, timestamp ) );
        break;

      case "users.changed":
        dispatch( eventAction( TYPES.EVENT_USERS_CHANGED, data, timestamp ) );
        break;

      case "groups.changed":
        dispatch( eventAction( TYPES.EVENT_GROUPS_CHANGED, data, timestamp ) );
        break;

      case "shares.changed":
        dispatch( eventAction( TYPES.EVENT_SHARES_CHANGED, data, timestamp ) );
        break;

      case "update.changed":
        dispatch( eventAction( TYPES.EVENT_UPDATE_CHANGED, data, timestamp ) );
        break;

      case "volumes.changed":
        dispatch( eventAction( TYPES.EVENT_VOLUMES_CHANGED, data, timestamp ) );
        break;
    }
  }
}
