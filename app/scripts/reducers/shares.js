// SHARES - REDUCER
// ================

"use strict";

import * as TYPES from "../actions/actionTypes";
import { recordUUID, resolveUUID, handleChangedEntities } from "../utility/Reducer";

const INITIAL_STATE =
  { queryRequests: new Set()
  , createRequests: new Set()
  , activeShare: ""
  , serverShares: {}
  , clientShares: {}
  };

const NEW_SHARE_INIT =
  { name: ""
  , id: "NEW" // This must not be submitted to the server!
  , type: "nfs"
  , target: null
  , properties: {}
  , enabled: true
  };

function normalizeShares ( shares ) {
  let normalized = {};

  shares.forEach( share => {
    normalized[ share.id ] = share;
  });

  return normalized;
}

export default function shares ( state = INITIAL_STATE, action ) {
  const { payload, error, type } = action;
  let clientShares;
  let serverShares;

  switch ( type ) {

    case TYPES.SHARES_RPC_REQUEST:
      return Object.assign( {}, state,
        recordUUID( payload.UUID, state, "queryRequests" )
      );


    // CLIENT MUTATIONS
    case TYPES.UPDATE_SHARE:
      clientShares = Object.assign( {}, state.clientShares );

      clientShares[ payload.id ] = Object.assign( {}
                                                , NEW_SHARE_INIT
                                                , clientShares[ payload.id ]
                                                , payload.data
                                                );

      return Object.assign( {}, state, { clientShares } );

    case TYPES.REVERT_SHARE:
      clientShares = Object.assign( {}, state.clientShares );
      delete clientShares[ payload.id ];
      return Object.assign( {}, state, { clientShares } );


    // GUI ACTIONS
    case TYPES.FOCUS_SHARE:
      return Object.assign( {}, state, { activeShare: payload.shareID } );

    case TYPES.BLUR_SHARE:
      return Object.assign( {}, state, { activeShare: "" } );


    // SUBMIT NEW VOLUME
    case TYPES.CREATE_SHARE_TASK_SUBMIT_REQUEST:
      return Object.assign( {}
                          , state
                          , recordUUID( payload.UUID, state, "createRequests" )
                          );


    // TODO: Handle these correctly
    case TYPES.RPC_TIMEOUT:
    case TYPES.RPC_FAILURE:
    case TYPES.RPC_SUCCESS:
      if ( state.queryRequests.has( payload.UUID ) ) {
        return Object.assign( {}, state
          , resolveUUID( payload.UUID, state, "queryRequests" )
          , { serverShares: normalizeShares( payload.data ) }
        );
      }

      // SHARE SUBMIT TASK
      if ( state.createRequests.has( payload.UUID ) ) {
        if ( payload.data ) {
          return Object.assign( {}
                              , state
                              , resolveUUID( payload.UUID, state, "createRequests" )
                              );
        } else {
          console.warn( "Share Submit task did not return a task ID" );
          return state;
        }
      }

      return state;

    case TYPES.ENTITY_CHANGED:
      if ( payload.mask === "shares.changed" ) {
        serverShares = handleChangedEntities( payload, state.serverShares );
        return Object.assign( {}
                            , state
                            , { serverShares }
                            );
      }
      return state;

    default:
      return state;
  }
}
