// GROUPS - ACTIONS
// ================

"use strict";

import { QUERY_GROUPS_REQUEST, GET_NEXT_GID_REQUEST }
  from "../actions/actionTypes";
import { watchRequest } from "../utility/Action";
import MC from "../websocket/MiddlewareClient";

export function requestGroups () {
  return ( dispatch ) => {
    MC.request( "groups.query"
              , []
              , ( UUID ) =>
                dispatch( watchRequest( UUID, QUERY_GROUPS_REQUEST ) )
              );
  }
};

export function requestNextGID () {
  return ( dispatch ) => {
    MC.request( "groups.next_gid"
              , []
              , ( UUID ) =>
                dispatch( watchRequest( UUID, GET_NEXT_GID_REQUEST ) )
              );
  }
};
