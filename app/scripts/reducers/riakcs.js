// RIAK CS REDUCER
// ==============
// riakcs namespace

"use strict";

import * as TYPES from "../actions/actionTypes";
import MiddlewareClient from "../websocket/MiddlewareClient";
import { recordUUID, resolveUUID }
  from "../utility/Reducer";

const INITIAL_STATE =
  { riakCSServerState:
    { enable: false
    , admin_secret: null
    , nodename: null
    , node_ip: null
    , stanchion_host_port: null
    , admin_key: null
    , listener_port: null
    , riak_host_ip: null
    , riak_host_port: null
    , anonymous_user_creation: false
    , max_buckets_per_user: null
    , log_console_level: null
    , stanchion_host_ip: null
    , listener_ip: null
    }
  , riakCSForm: {}
  , riakCSConfigRequests: new Set()
  , configureRiakCSTaskRequests: new Set()
  , toggleRiakCSTaskRequests: new Set()
  , configureRiakCSTasks: new Set()
  , toggleRiakCSTasks: new Set()
  };

export default function riakcs ( state = INITIAL_STATE, action ) {
  const { payload, error, type } = action;

  var riakCSServerState, riakCSForm, riakCSConfigRequests;

  switch ( type ) {
    // FORM
    case TYPES.UPDATE_RIAKCS_FORM:
      riakCSForm = Object.assign( {}, state.riakCSForm );
      riakCSForm[ payload.field ] = payload.value;
      if ( payload.value === "" ) {
        riakCSForm[ payload.field ] = null;
      }
      return Object.assign( {}, state, { riakCSForm } );

    case TYPES.RESET_RIAKCS_FORM:
      return Object.assign( {}, state, { riakCSForm: {} } );

    // QUERIES
    case TYPES.RIAKCS_CONFIG_REQUEST:
      return Object.assign( {}
                          , state
                          , recordUUID( payload.UUID
                                      , state
                                      , "riakCSConfigRequests"
                                      )
                          );

    // TASKS
    case TYPES.CONFIGURE_RIAKCS_TASK_REQUEST:
      return Object.assign( {}
                          , state
                          , recordUUID( payload.UUID
                                      , state
                                      , "configureRiakCSTaskRequests"
                                      )
                          );
    case TYPES.TOGGLE_RIAKCS_TASK_REQUEST:
      return Object.assign( {}
                          , state
                          , recordUUID( payload.UUID
                                      , state
                                      , "toggleRiakCSTaskRequests"
                                      )
                          );

    // RPC Handling
    case TYPES.RPC_TIMEOUT:
    case TYPES.RPC_FAILURE:
    case TYPES.RPC_SUCCESS:

      if ( state.riakCSConfigRequests.has( payload.UUID ) ) {
        riakCSServerState = Object.assign( {}
                                          , state.riakCSServerState
                                          , payload.data
                                          );
        return Object.assign( {}, state, { riakCSServerState }
                            , resolveUUID( payload.UUID
                                         , state
                                         , "riakCSConfigRequests"
                                         )
                            );
      } else {
        return state;
      }

    case TYPES.ENTITY_CHANGED:
      if ( payload.mask === "services.changed"
        && payload.data.entities[0].name === "riakcs"
         ) {
        riakCSServerState = Object.assign( {}
                                         , state.riakCSServerState
                                         , payload.data.entities[0].config
                                         );
        return Object.assign( {}, state, { riakCSServerState } );
      }
      return state;

    // TODO: TASK HANDLING

    default:
      return state;
  }
};
