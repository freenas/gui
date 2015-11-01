// RIAK REDUCER
// ==============
// riak namespace

"use strict";

import * as TYPES from "../actions/actionTypes";
import MiddlewareClient from "../websocket/MiddlewareClient";
import { recordUUID, resolveUUID }
  from "../utility/Reducer";

const INITIAL_STATE =
  { riakServerState:
    { enable: false
    , listener_protobuf_internal: null
    , nodename: null
    , node_ip: null
    , object_size_warning_threshold: null
    , storage_backend: null
    , save_description: false
    , riak_control: false
    , listener_protobuf_internal_port: null
    , listener_http_internal: null
    , listener_http_internal_port: null
    , buckets_default_allow_multi: false
    , listener_https_internal_port: null
    , listener_https_internal: null
    , object_size_maximum: null
    }
  , riakForm: {}
  , riakConfigRequests: new Set()
  , configureRiakTaskRequests: new Set()
  , toggleRiakTaskRequests: new Set()
  , configureRiakTasks: new Set()
  , toggleRiakTasks: new Set()
  };


export default function riak ( state = INITIAL_STATE, action ) {
  const { payload, error, type } = action;

  var riakServerState, riakForm, riakConfigRequests;

  switch ( type ) {
    // FORM
    case TYPES.UPDATE_RIAK_FORM:
      riakForm = Object.assign( {}, state.riakForm );
      riakForm[ payload.field ] = payload.value;
      if ( payload.value === "" ) {
        riakForm[ payload.field ] = null;
      }
      return Object.assign( {}, state, { riakForm } );

    case TYPES.RESET_RIAK_FORM:
      return Object.assign( {}, state, { riakForm: {} } );

    // QUERIES
    case TYPES.RIAK_CONFIG_REQUEST:
      return Object.assign( {}
                          , state
                          , recordUUID( payload.UUID
                                      , state
                                      , "riakConfigRequests"
                                      )
                          );

    // TASKS
    case TYPES.CONFIGURE_RIAK_TASK_REQUEST:
      return Object.assign( {}
                          , state
                          , recordUUID( payload.UUID
                                      , state
                                      , "configureRiakTaskRequests"
                                      )
                          );
    case TYPES.TOGGLE_RIAK_TASK_REQUEST:
      return Object.assign( {}
                          , state
                          , recordUUID( payload.UUID
                                      , state
                                      , "toggleRiakTaskRequests"
                                      )
                          );

    // RPC Handling
    case TYPES.RPC_TIMEOUT:
    case TYPES.RPC_FAILURE:
    case TYPES.RPC_SUCCESS:

      if ( state.riakConfigRequests.has( payload.UUID ) ) {
        riakServerState = Object.assign( {}
                                       , state.riakServerState
                                       , payload.data
                                       );
        return Object.assign( {}, state, { riakServerState }
                            , resolveUUID( payload.UUID
                                         , state
                                         , "riakConfigRequests"
                                         )
                            );
      } else {
        return state;
      }

    case TYPES.ENTITY_CHANGED:
      if ( payload.mask === "services.changed"
        && payload.data.entities[0].name === "riak"
         ) {
        riakServerState = Object.assign( {}
                                      , state.riakServerState
                                      , payload.data.entities[0].config
                                      );
        return Object.assign( {}, state, { riakServerState } );
      }
      return state;

    // TODO: TASK HANDLING

    default:
      return state;
  }
};
