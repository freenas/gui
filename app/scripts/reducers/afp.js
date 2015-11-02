// AFP REDUCER
// =============
// afp namespace

"use strict";

import * as TYPES from "../actions/actionTypes";
import MiddlewareClient from "../websocket/MiddlewareClient";
import { recordUUID, resolveUUID } from "../utility/Reducer";

const INITIAL_STATE =
  { afpServerState:
    { enable: false
    , connections_limit: null
    , guest_user: null
    , dbpath: ""
    , homedir_path: ""
    , bind_addresses: []
    , homedir_name: ""
    , homedir_enable: false
    , guest_enable: false
    }
  , afpForm: {}
  , afpConfigRequests: new Set()
  , configureAFPTaskRequests: new Set()
  , toggleAFPTaskRequests: new Set()
  , configureAFPTasks: new Set()
  , toggleAFPTasks: new Set()
  };

export default function afp ( state = INITIAL_STATE, action ) {
  const { payload, error, type } = action;

  var afpServerState, afpForm, afpConfigRequests;

  switch ( type ) {
    // FORM
    case TYPES.UPDATE_AFP_FORM:
      afpForm = Object.assign( {}, state.afpForm );
      afpForm[ payload.field ] = payload.value;
      return Object.assign( {}, state, { afpForm } );

    case TYPES.RESET_AFP_FORM:
      return Object.assign( {}, state, { afpForm: {} } );

    // QUERIES
    case TYPES.AFP_CONFIG_REQUEST:
      return Object.assign( {}
                          , state
                          , recordUUID( payload.UUID
                                      , state
                                      , "afpConfigRequests"
                                      )
                          );

    // TASKS
    case TYPES.CONFIGURE_AFP_TASK_REQUEST:
      return Object.assign( {}
                          , state
                          , recordUUID( payload.UUID
                                      , state
                                      , "configureAFPTaskRequests"
                                      )
                          );
    case TYPES.TOGGLE_AFP_TASK_REQUEST:
      return Object.assign( {}
                          , state
                          , recordUUID( payload.UUID
                                      , state
                                      , "toggleAFPTaskRequests"
                                      )
                          );

    // RPC Handling
    case TYPES.RPC_TIMEOUT:
    case TYPES.RPC_FAILURE:
    case TYPES.RPC_SUCCESS:

      if ( state.afpConfigRequests.has( payload.UUID ) ) {
        afpServerState = Object.assign( {}
                                      , state.afpServerState
                                      , payload.data
                                      );
        return Object.assign( {}, state, { afpServerState }
                            , resolveUUID( payload.UUID
                                         , state
                                         , "afpConfigRequests"
                                         )
                            );
      } else {
        return state;
      }

    case TYPES.ENTITY_CHANGED:
      if ( payload.mask === "services.changed"
        && payload.data.entities[0].name === "afp"
         ) {
        afpServerState = Object.assign( {}
                                      , state.afpServerState
                                      , payload.data.entities[0].config
                                      );
        return Object.assign( {} , state , { afpServerState } );
      } else {
        return state;
      }

    // TODO: TASK HANDLING

    default:
      return state;
  }
};
