// SHELLS - REDUCER
// ================

"use strict";

import * as TYPES from "../actions/actionTypes";

const INITIAL_STATE =
  { spawnRequests: new Set()
  , fetchRequests: new Set()
  , available: []
  , token: ""
  };

export default function shells ( state = INITIAL_STATE, action ) {
  const { payload, error, type } = action;
  let spawnRequests, fetchRequests;

  switch ( type ) {

    case TYPES.GET_SHELLS_REQUEST:
      fetchRequests = state.fetchRequests;

      fetchRequests.add( payload.UUID );

      return Object.assign( {}, state,
        { isFetching: true
        , fetchRequests
        }
      );

    case TYPES.SPAWN_SHELL_REQUEST:
      spawnRequests = state.spawnRequests;

      spawnRequests.add( payload.UUID );

      return Object.assign( {}, state,
        { isFetching: true
        , spawnRequests
        }
      );

    // TODO: Handle these correctly
    case TYPES.RPC_TIMEOUT:
    case TYPES.RPC_FAILURE:
    case TYPES.RPC_SUCCESS:
      if ( state.fetchRequests.has( payload.UUID ) ) {
        fetchRequests = new Set( state.fetchRequests );

        fetchRequests.delete( payload.UUID );

        return Object.assign( {}, state,
          { isFetching: Boolean( fetchRequests.size )
          , fetchRequests
          }
        );
      } else if ( state.spawnRequests.has( payload.UUID ) ) {
        spawnRequests = new Set( state.spawnRequests );

        spawnRequests.delete( payload.UUID );

        return Object.assign( {}, state, { token: payload.data });
      } else {
        return state;
      }

    default:
      return state;
  }
}
