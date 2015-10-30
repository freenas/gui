// SMB REDUCER
// =============
// smb namespace

"use strict";

import * as TYPES from "../actions/actionTypes";
import MiddlewareClient from "../websocket/MiddlewareClient";
import { recordUUID, resolveUUID } from "../utility/Reducer";

const INITIAL_STATE =
  { smbServerState:
    { dos_charset: "CP437"
    , filemask: null
    , unix_charset: "UTF-8"
    , domain_logons: false
    , max_protocol: "SMB3_00"
    , netbiosname: [ "" ]
    , empty_password: false
    , dirmask: null
    , description: ""
    , log_level: "NONE"
    , min_protocol: null
    , obey_pam_restrictions: false
    , workgroup: null
    , time_server: false
    , guest_user: null
    , local_master: false
    , hostlookup: false
    , syslog: false
    , zeroconf: false
    , execute_always: false
    , unixext: false
    , bind_addresses: [ "" ]
    , enable: false
    }
  , smbForm: {}
  , smbConfigRequests: new Set()
  , configureSMBTaskRequests: new Set()
  , toggleSMBTaskRequests: new Set()
  , configureSMBTasks: new Set()
  , toggleSMBTasks: new Set()
  };

export default function smb ( state = INITIAL_STATE, action ) {
  const { payload, error, type } = action;

  var smbServerState, smbForm, smbConfigRequests;

  switch ( type ) {
    // FORM
    case TYPES.UPDATE_SMB_FORM:
      smbForm = Object.assign( {}, state.smbForm );
      if ( payload.field === "netbiosname" ) {
        smbForm[ payload.field ] = [ payload.value ];
      } else {
        smbForm[ payload.field ] = payload.value;
      }

    case TYPES.RESET_SMB_FORM:
      return Object.assign( {}, state, { smbForm: {} } );

    // QUERIES
    case TYPES.SMB_CONFIG_REQUEST:
      return Object.assign( {}
                          , state
                          , recordUUID( payload.UUID
                                      , state
                                      , "smbConfigRequests"
                                      )
                          );

    // TASKS
    case TYPES.CONFIGURE_SMB_TASK_REQUEST:
      return Object.assign( {}
                          , state
                          , recordUUID( payload.UUID
                                      , state
                                      , "configureSMBTaskRequests"
                                      )
                          );
    case TYPES.TOGGLE_SMB_TASK_REQUEST:
      return Object.assign( {}
                          , state
                          , recordUUID( payload.UUID
                                      , state
                                      , "toggleSMBTaskRequests"
                                      )
                          );

    // RPC Handling
    case TYPES.RPC_TIMEOUT:
    case TYPES.RPC_FAILURE:
    case TYPES.RPC_SUCCESS:

      if ( state.smbConfigRequests.has( payload.UUID ) ) {
        smbServerState = Object.assign( {}
                                      , state.smbServerState
                                      , payload.data
                                      );
        return Object.assign( {}, state, { smbServerState }
                            , resolveUUID( payload.UUID
                                         , state
                                         , "smbConfigRequests"
                                         )
                            );
      } else {
        return state;
      }

    case TYPES.ENTITY_CHANGED:
      if ( payload.mask === "services.changed"
        && payload.data.entities[0].name === "cifs"
         ) {
        smbServerState = Object.assign( {}
                                      , state.smbServerState
                                      , payload.data.entities[0].config
                                      );
        return Object.assign( {} , state , { smbServerState } );
      } else {
        return state;
      }

    // TODO: TASK HANDLING

    default:
      return state;
  }
};
