// EVENTS - REDUCER
// ================

"use strict";

import * as TYPES from "../actions/actionTypes";

const INITIAL_STATE =
  { events: "TODO: Store events :)"
  };


export default function disks ( state = INITIAL_STATE, action ) {
  const { payload, error, type } = action;

  switch( type ) {
    case TYPES.EVENT_CLIENT_LOGIN:
    case TYPES.EVENT_CLIENT_LOGOUT:
    case TYPES.EVENT_DEVICE_CHANGED:
    case TYPES.EVENT_DEVICE_DETACHED:
    case TYPES.EVENT_INTERFACE_ATTACHED:
    case TYPES.EVENT_INTERFACE_DETACHED:
    case TYPES.EVENT_INTERFACE_LINK_UP:
    case TYPES.EVENT_INTERFACE_LINK_DOWN:
    case TYPES.EVENT_USERS_CHANGED:
    case TYPES.EVENT_GROUPS_CHANGED:
    case TYPES.EVENT_SHARES_CHANGED:
    case TYPES.EVENT_UPDATE_CHANGED:
    case TYPES.EVENT_VOLUMES_CHANGED:
      return state;

    default:
      return state;
  }
}
