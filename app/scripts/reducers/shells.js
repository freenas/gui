// SHELLS - REDUCER
// ================

"use strict";

import * as TYPES from "../actions/actionTypes";
import { recordUUID, resolveUUID } from "../utility/Reducer";

const INITIAL_STATE =
  { spawnRequests: new Set()
  , fetchRequests: new Set()
  , available: []
  , token: ""
  };

export default function shells ( state = INITIAL_STATE, action ) {
  const { payload, error, type } = action;

  switch ( type ) {

    case TYPES.GET_SHELLS_REQUEST:
      return Object.assign( {}, state,
        recordUUID( payload.UUID, state, "fetchRequests" )
      );

    case TYPES.SPAWN_SHELL_REQUEST:
      return Object.assign( {}, state,
        recordUUID( payload.UUID, state, "spawnRequests" )
      );

    // TODO: Handle these correctly
    case TYPES.RPC_TIMEOUT:
    case TYPES.RPC_FAILURE:
    case TYPES.RPC_SUCCESS:
      if ( state.fetchRequests.has( payload.UUID ) ) {
        return Object.assign( {}, state
          , { available: payload.data }
          , resolveUUID( payload.UUID, state, "fetchRequests" )
        );
      } else if ( state.spawnRequests.has( payload.UUID ) ) {
        return Object.assign( {}, state
          , { token: payload.data }
          , resolveUUID( payload.UUID, state, "spawnRequests" )
        );
      } else {
        return state;
      }

    default:
      return state;
  }
}
