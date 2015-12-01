// HAPROXY REDUCER
// ===============
// haproxy namespace

"use strict";

import * as TYPES from "../actions/actionTypes";
import MiddlewareClient from "../websocket/MiddlewareClient";
import { recordUUID, resolveUUID }
  from "../utility/Reducer";

const INITIAL_STATE =
  { haproxyServerState:
    { frontend_mode: "HTTP"
    , defaults_maxconn: null
    , https_port: null
    , global_maxconn: null
    , backend_mode: "HTTP"
    , http_ip: null
    , http_port: null
    , https_ip: null
    , enable: false
    }
  , haproxyForm: {}
  , haproxyConfigRequests: new Set()
  , configureHAProxyTaskRequests: new Set()
  , toggleHAProxyTaskRequests: new Set()
  , configureHAProxyTasks: new Set()
  , toggleHAProxyTasks: new Set()
  };


export default function haproxy ( state = INITIAL_STATE, action ) {
  const { payload, error, type } = action;

  var haproxyServerState, haproxyForm, haproxyConfigRequests;

  switch ( type ) {
    // FORM
    case TYPES.UPDATE_HAPROXY_FORM:
      haproxyForm = Object.assign( {}, state.haproxyForm );
      haproxyForm[ payload.field ] = payload.value;
      if ( payload.value === "" ) {
        haproxyForm[ payload.field ] = null;
      }
      return Object.assign( {}, state, { haproxyForm } );

    case TYPES.RESET_HAPROXY_FORM:
      return Object.assign( {}, state, { haproxyForm: {} } );

    // QUERIES
    case TYPES.HAPROXY_CONFIG_REQUEST:
      return Object.assign( {}
                          , state
                          , recordUUID( payload.UUID
                                      , state
                                      , "haproxyConfigRequests"
                                      )
                          );

    // TASKS
    case TYPES.CONFIGURE_HAPROXY_TASK_REQUEST:
      return Object.assign( {}
                          , state
                          , recordUUID( payload.UUID
                                      , state
                                      , "configureHAProxyTaskRequests"
                                      )
                          );
    case TYPES.TOGGLE_HAPROXY_TASK_REQUEST:
      return Object.assign( {}
                          , state
                          , recordUUID( payload.UUID
                                      , state
                                      , "toggleHAProxyTaskRequests"
                                      )
                          );

    // RPC Handling
    case TYPES.RPC_TIMEOUT:
    case TYPES.RPC_FAILURE:
    case TYPES.RPC_SUCCESS:

      if ( state.haproxyConfigRequests.has( payload.UUID ) ) {
        haproxyServerState = Object.assign( {}
                                          , state.haproxyServerState
                                          , payload.data
                                          );
        return Object.assign( {}, state, { haproxyServerState }
                            , resolveUUID( payload.UUID
                                         , state
                                         , "haproxyConfigRequests"
                                         )
                            );
      } else {
        return state;
      }

    case TYPES.ENTITY_CHANGED:
      if ( payload.mask === "service.changed"
        && payload.data.entities[0].name === "haproxy"
         ) {
        haproxyServerState = Object.assign( {}
                                          , state.haproxyServerState
                                          , payload.data.entities[0].config
                                          );
        return Object.assign( {}, state, { haproxyServerState } );
      }
      return state;

    // TODO: TASK HANDLING

    default:
      return state;
  }
};
