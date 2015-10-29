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

export function createShare ( share ) {
  return ( dispatch, getState ) => {
    MC.submitTask( [ "share.create", [ share ] ]
                 , ( UUID ) =>
                   dispatch( watchRequest( UUID, TYPES.CREATE_SHARE_TASK_SUBMIT_REQUEST ) )
                 );
  }
}

export function updateShare ( name ) {
  return ( dispatch, getState ) => {
    MC.submitTask( [ "share.update", [ name ] ]
                 , ( UUID ) =>
                   dispatch( watchRequest( UUID, TYPES.UPDATE_SHARE_TASK_SUBMIT_REQUEST ) )
                 );
  }
}

export function deleteShare ( name ) {
  return ( dispatch, getState ) => {
    MC.submitTask( [ "share.delete", [ name ] ]
                 , ( UUID ) =>
                   dispatch( watchRequest( UUID, TYPES.DELETE_SHARE_TASK_SUBMIT_REQUEST ) )
                 );
  }
}
