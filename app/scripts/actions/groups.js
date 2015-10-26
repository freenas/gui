// GROUPS - ACTIONS
// ================

"use strict";

import { UPDATE_GROUP_FORM
       , RESET_GROUP_FORM
       , QUERY_GROUPS_REQUEST
       , GET_NEXT_GID_REQUEST
       }
  from "../actions/actionTypes";
import { watchRequest } from "../utility/Action";
import MC from "../websocket/MiddlewareClient";

// FORM
export function updateGroupForm ( field, value ) {
  return ( { type: UPDATE_GROUP_FORM
           , payload: { field: field
                      , value: value
                      }
           }
         );
};

export function resetGroupForm () {
  return ( { type: RESET_GROUP_FORM } );
};

// QUERIES
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
