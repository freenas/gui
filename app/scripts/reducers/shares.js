// SHARES - REDUCER
// ================

"use strict";

import * as TYPES from "../actions/actionTypes";
import { recordUUID, resolveUUID } from "../utility/Reducer";

const INITIAL_STATE =
  { sharesRequests: new Set()
  , shares: {}
  };

function normalizeShares ( data ) {
  console.log( data );
  return {};
}

export default function shells ( state = INITIAL_STATE, action ) {
  const { payload, error, type } = action;

  switch ( type ) {

    case TYPES.SHARES_RPC_REQUEST:
      return Object.assign( {}, state,
        recordUUID( payload.UUID, state, "sharesRequests" )
      );

    // TODO: Handle these correctly
    case TYPES.RPC_TIMEOUT:
    case TYPES.RPC_FAILURE:
    case TYPES.RPC_SUCCESS:
      if ( state.sharesRequests.has( payload.UUID ) ) {
        return Object.assign( {}, state
          , resolveUUID( payload.UUID, state, "fetchRequests" )
          , { shares: normalizeShares( payload.data ) }
        );
      } else {
        return state;
      }

    default:
      return state;
  }
}
