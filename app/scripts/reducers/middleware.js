// FREENAS MIDDLEWARE CONNECTION - REDUCER
// =======================================

"use strict";

import * as actionTypes from "../actions/actionTypes";

const READY_STATE =
  { 0: "CONNECTING"
  , 1: "OPEN"
  , 2: "CLOSING"
  , 3: "CLOSED"
  };

const INITIAL_STATE =
  { isConnecting : false
  , readyState   : null
  , protocol     : null
  , host         : null
  , path         : null
  , mode         : null
  };


export default function auth ( state = INITIAL_STATE, action ) {
  const { payload, error, type } = action;

  switch( type ) {
    case actionTypes.WS_STATE_CHANGED:
      return Object.assign( {}, state,
        { readyState: READY_STATE[ payload.readyState ] }
      );

    case actionTypes.WS_TARGET_CHANGED:
      return Object.assign( {}, state,
        { ...payload }
      );

    default:
      return state;
  }

}
