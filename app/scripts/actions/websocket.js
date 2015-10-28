// FREENAS WEBSOCKET CONNECTION - ACTION CREATORS
// ==============================================

"use strict";

import * as actionTypes from "./actionTypes";
import MiddlewareClient from "../websocket/MiddlewareClient";

export function changeSockState ( readyState, closeEvent ) {
  switch ( readyState ) {
    case 0:
      return { type: actionTypes.WS_CONNECTING };

    case 1:
      return { type: actionTypes.WS_OPEN };

    case 2:
      return { type: actionTypes.WS_CLOSING };

    case 3:
      return (
        { type: actionTypes.WS_CLOSED
        , payload: { code: closeEvent.code }
        }
      );
  }
}

export function changeSockTarget ( targetData ) {
  return (
    { type: actionTypes.WS_TARGET_CHANGED
    , payload: { ...targetData }
    }
  )
}

export function attemptConnection () {
  return { type: actionTypes.WS_ATTEMPT_CONNECTION }
}

export function reconnectTick () {
  return { type: actionTypes.WS_RECONNECT_TICK }
}
