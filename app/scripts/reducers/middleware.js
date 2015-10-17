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
  { isChanging : true
  , SIDShow    : true
  , SIDMessage : ""
  , readyState : null
  , protocol   : ""
  , host       : ""
  , path       : ""
  , mode       : ""
  };

function getSIDMessage ( state, readyState ) {
  switch ( readyState ) {
    case 0:
      return `Connecting`;

    case 2:
      return `Disconnected`;

    case 3:
      return `Re-establishing connection`;

    default:
      return "";
  }
}

export default function auth ( state = INITIAL_STATE, action ) {
  const { payload, error, type } = action;

  switch( type ) {
    case actionTypes.WS_STATE_CHANGED:
      return Object.assign( {}, state,
        { isChanging : payload.readyState === 0 || payload.readyState === 2
        , SIDShow    : payload.readyState === 0 || payload.readyState === 2
        , readyState : READY_STATE[ payload.readyState ]
        , SIDMessage : getSIDMessage( state, payload.readyState )
        }
      );

    case actionTypes.WS_TARGET_CHANGED:
      return Object.assign( {}, state,
        { ...payload }
      );

    default:
      return state;
  }

}
