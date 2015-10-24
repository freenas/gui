// USERS - REDUCER
// ===============

"use strict";

import * as TYPES from "../actions/actionTypes";
import { recordUUID, resolveUUID } from "../utility/Reducer";

const INITIAL_STATE =
  { queryUsersRequests: new Set()
  , getNextUIDRequests: new Set()
  , users: []
  , userForm:
    { username: ""
    , sshpubkey: null
    , shell: ""
    , locked: false
    , groups: []
    , attributes: {}
    , unixhash: null
    , sudo: false
    , smbhash: null
    , email: null
    , full_name: null
    , home: ""
    , group: null
    , password: null
    , id: null
    , password_disabled: false
    }
  , nextUID: null
  };

export default function users ( state = INITIAL_STATE, action ) {
  const { payload, error, type } = action;

  switch ( type ) {
    case TYPES.QUERY_USERS_REQUEST:
      return Object.assign( {}, state,
        recordUUID( payload.UUID, state, "queryUsersRequests" )
      );

    case TYPES.GET_NEXT_UID_REQUEST:
      return Object.assign( {}, state,
        recordUUID( payload.UUID, state, "getNextUIDRequests" )
      );

    // TODO: Handle these correctly
    case TYPES.RPC_TIMEOUT:
    case TYPES.RPC_FAILURE:
    case TYPES.RPC_SUCCESS:
      if ( state.queryUsersRequests.has( payload.UUID ) ) {
        return Object.assign( {}, state
          , { users: payload.data }
          , resolveUUID( payload.UUID, state, "queryUsersRequests" )
        );
      } else if ( state.getNextUIDRequests.has( payload.UUID ) ) {
        return Object.assign( {}, state
          , { nextUID: payload.data }
          , resolveUUID( payload.UUID, state, "getNextUIDRequests" )
        );
      } else {
        return state;
      }

    default:
      return state;
  }
};
