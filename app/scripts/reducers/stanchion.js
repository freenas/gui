// STANCHION REDUCER
// =================
// stanchion namespace

"use strict";

import * as TYPES from "../actions/actionTypes";
import MiddlewareClient from "../websocket/MiddlewareClient";
import { recordUUID, resolveUUID }
  from "../utility/Reducer";

const INITIAL_STATE =
  { stanchionServerState:
    { enable: false
    , riak_host_ip: null
    , admin_secret: null
    , riak_host_port: null
    , nodename: null
    , node_ip: null
    , admin_key: null
    , log_console_level: null
    , listener_port: null
    , listener_ip: null
    }
  , stanchionForm: {}
  , stanchionConfigRequests: new Set()
  , configureStanchionTaskRequests: new Set()
  , toggleStanchionTaskRequests: new Set()
  , configureStanchionTasks: new Set()
  , toggleStanchionTasks: new Set()
  };

export default function stanchion ( state = INITIAL_STATE, action ) {
  const { payload, error, type } = action;

  var stanchionServerState, stanchionForm, stanchionConfigRequests;

  switch ( type ) {
    // FORM
    case TYPES.UPDATE_STANCHION_FORM:
      stanchionForm = Object.assign( {}, state.stanchionForm );
      stanchionForm[ payload.field ] = payload.value;
      if ( payload.value === "" ) {
        stanchionForm[ payload.field ] = null;
      }
      return Object.assign( {}, state, { stanchionForm } );

    case TYPES.RESET_STANCHION_FORM:
      return Object.assign( {}, state, { stanchionForm: {} } );

    // QUERIES
    case TYPES.STANCHION_CONFIG_REQUEST:
      return Object.assign( {}
                          , state
                          , recordUUID( payload.UUID
                                      , state
                                      , "stanchionConfigRequests"
                                      )
                          );

    // TASKS
    case TYPES.CONFIGURE_STANCHION_TASK_REQUEST:
      return Object.assign( {}
                          , state
                          , recordUUID( payload.UUID
                                      , state
                                      , "configureStanchionTaskRequests"
                                      )
                          );
    case TYPES.TOGGLE_STANCHION_TASK_REQUEST:
      return Object.assign( {}
                          , state
                          , recordUUID( payload.UUID
                                      , state
                                      , "toggleStanchionTaskRequests"
                                      )
                          );

    // RPC Handling
    case TYPES.RPC_TIMEOUT:
    case TYPES.RPC_FAILURE:
    case TYPES.RPC_SUCCESS:

      if ( state.stanchionConfigRequests.has( payload.UUID ) ) {
        stanchionServerState = Object.assign( {}
                                            , state.stanchionServerState
                                            , payload.data
                                            );
        return Object.assign( {}, state, { stanchionServerState }
                            , resolveUUID( payload.UUID
                                         , state
                                         , "stanchionConfigRequests"
                                         )
                            );
      } else {
        return state;
      }

    case TYPES.ENTITY_CHANGED:
      if ( payload.mask === "services.changed"
        && payload.data.entities[0].name === "stanchion"
         ) {
        stanchionServerState = Object.assign( {}
                                            , state.stanchionServerState
                                            , payload.data.entities[0].config
                                            );
        return Object.assign( {}, state, { stanchionServerState } );
      }
      return state;

    // TODO: TASK HANDLING

    default:
      return state;
  }
};
