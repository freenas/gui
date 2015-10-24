// USERS - ACTIONS
// ===============

"use strict";

import { QUERY_USERS_REQUEST, GET_NEXT_UID_REQUEST }
  from "../actions/actionTypes";
import { watchRequest } from "../utility/Action";
import MC from "../websocket/MiddlewareClient";

export function requestUsers () {
  return ( dispatch ) => {
    MC.request( "users.query"
              , []
              , ( UUID ) =>
                dispatch( watchRequest( UUID, QUERY_USERS_REQUEST ) )
              );
  }
};

export function requestNextUID () {
  return ( dispatch ) => {
    MC.request( "users.next_uid"
              , []
              , ( UUID ) =>
                dispatch( watchRequest( UUID, GET_NEXT_UID_REQUEST ) )
              );
  }
};
