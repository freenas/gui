// SHARES - ACTION CREATORS
// ========================

"use strict";

import * as TYPES from "./actionTypes";
import { watchRequest } from "../utility/Action";
import MC from "../websocket/MiddlewareClient";

export function fetchShares () {
  return ( dispatch, getState ) => {
    MC.request( "shares.query"
              , []
              , ( UUID ) =>
                dispatch( watchRequest( UUID, TYPES.SHARES_RPC_REQUEST ) )
              );
  }
}
