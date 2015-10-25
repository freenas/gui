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
  , sshManageRequests: new Set()
  };

export default function ssh ( state = INITIAL_STATE, action ) {
  const { payload, error, type } = action;

  var sshServerState, sshForm, sshConfigRequests;

  switch ( type ) {
    // FORM
    case TYPES.UPDATE_SSH_FORM:
      var sshForm = Object.assign( {}, state.sshForm );
      sshForm[ payload.field ] = payload.value;
      return Object.assign( {}, state, { sshForm } );
    case TYPES.RESET_SSH_FORM:
      return Object.assign( {}, state, { sshForm: {} } );

    // QUERIES
    case TYPES.SSH_CONFIG_REQUEST:
      sshConfigRequests = new Set( state.sshConfigRequests );
      sshConfigRequests.add( payload.UUID );
      return Object.assign( {}, state, { sshConfigRequests } );

    // TASKS
    case TYPES.SUBMIT_SSH_FORM:
      return state;
    case TYPES.DISABLE_SSH:
      return state;
    case TYPES.ENABLE_SSH:
      return state;

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

    default:
      return state;
  }
};
