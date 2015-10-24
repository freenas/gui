// GROUPS - REDUCER
// ================

"use strict";

import * as TYPES from "../actions/actionTypes";
import { recordUUID, resolveUUID } from "../utility/Reducer";

const INITIAL_STATE =
  { queryGroupsRequests: new Set()
  , getNextGIDRequests: new Set()
  , groups: []
  , groupForm:
    { name: ""
    , id: null
    , sudo: false
    }
  , nextGID: null
  };

export default function groups ( state = INITIAL_STATE, action ) {
  const { payload, error, type } = action;

  switch ( type ) {
    case TYPES.QUERY_GROUPS_REQUEST:
      return Object.assign( {}, state,
        recordUUID( payload.UUID, state, "queryGroupsRequests" )
      );

    case TYPES.GET_NEXT_GID_REQUEST:
      return Object.assign( {}, state,
        recordUUID( payload.UUID, state, "getNextGIDRequests" )
      );

    // TODO: Handle these correctly
    case TYPES.RPC_TIMEOUT:
    case TYPES.RPC_FAILURE:
    case TYPES.RPC_SUCCESS:
      if ( state.queryGroupsRequests.has( payload.UUID ) ) {
        return Object.assign( {}, state
          , { groups: payload.data }
          , resolveUUID( payload.UUID, state, "queryGroupsRequests" )
        );
      } else if ( state.getNextGIDRequests.has( payload.UUID ) ) {
        return Object.assign( {}, state
          , { nextGID: payload.data }
          , resolveUUID( payload.UUID, state, "getNextGIDRequests" )
        );
      } else {
        return state;
      }

    default:
      return state;
  }
};
