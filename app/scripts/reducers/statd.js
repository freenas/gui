// STATD REDUCER
// =============

"use strict";

import _ from "lodash";
import * as TYPES from "../actions/actionTypes";
import { recordUUID, resolveUUID } from "../utility/Reducer";
import { STATS as STATS_LIMIT } from "../constants/StoreLimits";

const INITIAL_STATE =
  { data: {}
  , historyRequests: new Map()
  };

export default function system ( state = INITIAL_STATE, action ) {
  const { payload, error, type } = action;
  let data;
  let historyRequests;

  switch ( type ) {
    case TYPES.STATD_HISTORY_REQUEST:
      historyRequests = new Map( state.historyRequests );
      historyRequests.set( payload.UUID, payload.source );
      return Object.assign( {}
                          , state
                          , { historyRequests }
                          );

    // RPC REQUEST RESOLUTION
    case TYPES.RPC_SUCCESS:
    case TYPES.RPC_FAILURE:
    case TYPES.RPC_TIMEOUT:
      // HANDLE HISTORY
      if ( state.historyRequests.has( payload.UUID ) ) {

        if ( payload.data ) {
          historyRequests = new Map( state.historyRequests );

          data = Object.assign( {}, state.data );
          data[ historyRequests.get( payload.UUID ) ] =
            _.takeRight( payload.data.data, STATS_LIMIT );

          historyRequests.delete( payload.UUID );

          return Object.assign( {}
                              , state
                              , { data, historyRequests }
                              );
        } else {
          console.warn( "statd history query did not return any data" );
        }
        return state;
      }

    default:
      return state;
  }
}
