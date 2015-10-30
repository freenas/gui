// SSH REDUCER
// ===========

"use strict";

import * as TYPES from "../actions/actionTypes";
import { recordUUID, resolveUUID } from "../utility/Reducer";

const INITIAL_STATE =
  { sshServerState:
    { sftp_log_facility: null
    , permit_root_login: false
    , compression: false
    , sftp_log_level: null
    , allow_password_auth: false
    , allow_port_forwarding: false
    , port: null
    }
  , sshForm: {}
  , sshConfigRequests: new Set()
  , configureSSHTaskRequests: new Set()
  , toggleSSHTaskRequests: new Set()
  , configureSSHTasks: new Set()
  , toggleSSHTasks: new Set()
  };

export default function ssh ( state = INITIAL_STATE, action ) {
  const { payload, error, type } = action;

  var sshServerState, sshForm, sshConfigRequests;

  switch ( type ) {
    // FORM
    case TYPES.UPDATE_SSH_FORM:
      sshForm = Object.assign( {}, state.sshForm );
      sshForm[ payload.field ] = payload.value;
      return Object.assign( {}, state, { sshForm } );
    case TYPES.RESET_SSH_FORM:
      return Object.assign( {}, state, { sshForm: {} } );

    // QUERIES
    case TYPES.SSH_CONFIG_REQUEST:
      return Object.assign( {}
                          , state
                          , recordUUID( payload.UUID
                                      , state
                                      , "sshConfigRequests"
                                      )
                          );

    // TASKS
    case TYPES.CONFIGURE_SSH_TASK_REQUEST:
      return Object.assign( {}
                          , state
                          , recordUUID( payload.UUID
                                      , state
                                      , "configureSSHTaskRequests"
                                      )
                          );
    case TYPES.TOGGLE_SSH_TASK_REQUEST:
      return Object.assign( {}
                          , state
                          , recordUUID( payload.UUID
                                      , state
                                      , "toggleSSHTaskRequests"
                                      )
                          );

    // RPC Handling
    case TYPES.RPC_TIMEOUT:
    case TYPES.RPC_FAILURE:
    case TYPES.RPC_SUCCESS:

      if ( state.sshConfigRequests.has( payload.UUID ) ) {
        sshServerState = Object.assign( {}
                                      , state.sshServerState
                                      , payload.data
                                      );
        return Object.assign( {}, state, { sshServerState }
                            , resolveUUID( payload.UUID
                                         , state
                                         , "sshConfigRequests"
                                         )
                            );
      } else {
        return state;
      }

    case TYPES.ENTITY_CHANGED:
      if ( payload.mask === "services.changed"
        && payload.data.entities[0].name === "sshd"
         ) {
        sshServerState = Object.assign( {}
                                      , state.sshServerState
                                      , payload.data.entities[0].config
                                      );
        return Object.assign( {} , state , { sshServerState } );
      } else {
        return state;
      }

    // TASK HANDLING
    case TYPES.TASK_CREATED:
    case TYPES.TASK_UPDATED:
    case TYPES.TASK_PROGRESS:
      if ( typeof payload.data === "object"
        && payload.data !== null
        && payload.data.hasOwnProperty( "name" )
        && payload.data.name.startsWith( "service" )
        ) {
        if ( payload.data.name === "service.ssh.configure" ) {
          return Object.assign( {}, state
            , recordUUID( payload.data.id, state, "configureSSHTasks" )
          );
        }
      }
      return state;
    case TYPES.TASK_FINISHED:
      if ( typeof payload.data === "object"
        && payload.data !== null
        && payload.data.hasOwnProperty( "name" )
        && payload.data.name.startsWith( "service" )
        ) {
        if ( payload.data.name === "service.ssh.configure" ) {
          return Object.assign( {}, state
            , resolveUUID( payload.data.id, state, "configureSSHTasks" )
          );
        }
      }
      return state;
    case TYPES.TASK_FAILED:
      if ( typeof payload.data === "object"
        && payload.data !== null
        && payload.data.hasOwnProperty( "name" )
        && payload.data.name.startsWith( "service" )
        ) {
        if ( payload.data.name === "service.ssh.configure" ) {
          return Object.assign( {}, state
            , resolveUUID( payload.data.id, state, "configureSSHTasks" )
          );
        }
      }
      return state;

    default:
      return state;
  }
};
