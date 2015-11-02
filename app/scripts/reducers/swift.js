// SWIFT REDUCER
// =============
// swift namespace

"use strict";

import * as TYPES from "../actions/actionTypes";
import MiddlewareClient from "../websocket/MiddlewareClient";
import { recordUUID, resolveUUID }
  from "../utility/Reducer";

const INITIAL_STATE =
  { swiftServerState:
    { enable: false
    , swift_hash_path_prefix: null
    , swift_hash_path_suffix: null
    }
  , swiftForm: {}
  , swiftConfigRequests: new Set()
  , configureSwiftTaskRequests: new Set()
  , toggleSwiftTaskRequests: new Set()
  , configureSwiftTasks: new Set()
  , toggleSwiftTasks: new Set()
  };


export default function swift ( state = INITIAL_STATE, action ) {
  const { payload, error, type } = action;

  var swiftServerState, swiftForm, swiftConfigRequests;

  switch ( type ) {
    // FORM
    case TYPES.UPDATE_SWIFT_FORM:
      swiftForm = Object.assign( {}, state.swiftForm );
      swiftForm[ payload.field ] = payload.value;
      if ( payload.value === "" ) {
        swiftForm[ payload.field ] = null;
      }
      return Object.assign( {}, state, { swiftForm } );

    case TYPES.RESET_SWIFT_FORM:
      return Object.assign( {}, state, { swiftForm: {} } );

    // QUERIES
    case TYPES.SWIFT_CONFIG_REQUEST:
      return Object.assign( {}
                          , state
                          , recordUUID( payload.UUID
                                      , state
                                      , "swiftConfigRequests"
                                      )
                          );

    // TASKS
    case TYPES.CONFIGURE_SWIFT_TASK_REQUEST:
      return Object.assign( {}
                          , state
                          , recordUUID( payload.UUID
                                      , state
                                      , "configureSwiftTaskRequests"
                                      )
                          );
    case TYPES.TOGGLE_SWIFT_TASK_REQUEST:
      return Object.assign( {}
                          , state
                          , recordUUID( payload.UUID
                                      , state
                                      , "toggleSwiftTaskRequests"
                                      )
                          );

    // RPC Handling
    case TYPES.RPC_TIMEOUT:
    case TYPES.RPC_FAILURE:
    case TYPES.RPC_SUCCESS:

      if ( state.swiftConfigRequests.has( payload.UUID ) ) {
        swiftServerState = Object.assign( {}
                                        , state.swiftServerState
                                        , payload.data
                                        );
        return Object.assign( {}, state, { swiftServerState }
                            , resolveUUID( payload.UUID
                                         , state
                                         , "swiftConfigRequests"
                                         )
                            );
      } else {
        return state;
      }

    case TYPES.ENTITY_CHANGED:
      if ( payload.mask === "services.changed"
        && payload.data.entities[0].name === "swift"
         ) {
        swiftServerState = Object.assign( {}
                                        , state.swiftServerState
                                        , payload.data.entities[0].config
                                        );
        return Object.assign( {}, state, { swiftServerState } );
      }
      return state;

    // TODO: TASK HANDLING

    default:
      return state;
  }
};
