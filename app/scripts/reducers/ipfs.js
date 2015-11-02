// IPFS REDUCER
// ============
// ipfs namespace

"use strict";

import * as TYPES from "../actions/actionTypes";
import MiddlewareClient from "../websocket/MiddlewareClient";
import { recordUUID, resolveUUID }
  from "../utility/Reducer";

const INITIAL_STATE =
  { ipfsServerState:
    { path: null
    , enable: false
    }
  , ipfsForm: {}
  , ipfsConfigRequests: new Set()
  , configureIPFSTaskRequests: new Set()
  , toggleIPFSTaskRequests: new Set()
  , configureIPFSTasks: new Set()
  , toggleIPFSTasks: new Set()
  };


export default function ipfs ( state = INITIAL_STATE, action ) {
  const { payload, error, type } = action;

  var ipfsServerState, ipfsForm, ipfsConfigRequests;

  switch ( type ) {
    // FORM
    case TYPES.UPDATE_IPFS_FORM:
      ipfsForm = Object.assign( {}, state.ipfsForm );
      ipfsForm[ payload.field ] = payload.value;
      if ( payload.value === "" ) {
        ipfsForm[ payload.field ] = null;
      }
      return Object.assign( {}, state, { ipfsForm } );

    case TYPES.RESET_IPFS_FORM:
      return Object.assign( {}, state, { ipfsForm: {} } );

    // QUERIES
    case TYPES.IPFS_CONFIG_REQUEST:
      return Object.assign( {}
                          , state
                          , recordUUID( payload.UUID
                                      , state
                                      , "ipfsConfigRequests"
                                      )
                          );

    // TASKS
    case TYPES.CONFIGURE_IPFS_TASK_REQUEST:
      return Object.assign( {}
                          , state
                          , recordUUID( payload.UUID
                                      , state
                                      , "configureIPFSTaskRequests"
                                      )
                          );
    case TYPES.TOGGLE_IPFS_TASK_REQUEST:
      return Object.assign( {}
                          , state
                          , recordUUID( payload.UUID
                                      , state
                                      , "toggleIPFSTaskRequests"
                                      )
                          );

    // RPC Handling
    case TYPES.RPC_TIMEOUT:
    case TYPES.RPC_FAILURE:
    case TYPES.RPC_SUCCESS:

      if ( state.ipfsConfigRequests.has( payload.UUID ) ) {
        ipfsServerState = Object.assign( {}
                                       , state.ipfsServerState
                                       , payload.data
                                       );
        return Object.assign( {}, state, { ipfsServerState }
                            , resolveUUID( payload.UUID
                                         , state
                                         , "ipfsConfigRequests"
                                         )
                            );
      } else {
        return state;
      }

    case TYPES.ENTITY_CHANGED:
      if ( payload.mask === "services.changed"
        && payload.data.entities[0].name === "ipfs"
         ) {
        ipfsServerState = Object.assign( {}
                                       , state.ipfsServerState
                                       , payload.data.entities[0].config
                                       );
        return Object.assign( {}, state, { ipfsServerState } );
      }
      return state;

    // TODO: TASK HANDLING

    default:
      return state;
  }
};
