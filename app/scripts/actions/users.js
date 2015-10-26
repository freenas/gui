// USERS - ACTIONS
// ===============

"use strict";

import { UPDATE_USER_FORM
       , RESET_USER_FORM
       , QUERY_USERS_REQUEST
       , GET_NEXT_UID_REQUEST
       }
  from "../actions/actionTypes";
import { watchRequest } from "../utility/Action";
import MC from "../websocket/MiddlewareClient";

// FORM
export function updateUserForm ( field, value ) {
  return ( { type: UPDATE_USER_FORM
           , payload: { field: field
                      , value: value
                      }
           }
         );
};

export function resetUserForm () {
  return ( { type: RESET_USER_FORM } );
};

// QUERIES
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
