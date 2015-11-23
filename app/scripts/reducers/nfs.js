// NFS REDUCER
// =============
// nfs namespace

"use strict";

import * as TYPES from "../actions/actionTypes";
import MiddlewareClient from "../websocket/MiddlewareClient";
import { recordUUID, resolveUUID } from "../utility/Reducer";

const INITIAL_STATE =
  { nfsServerState:
    { enable: false
    , udp: false
    , v4: false
    , v4_kerberos: false
    , mountd_port: null
    , bind_addresses: null
    , rpclockd_port: null
    , rpcstatd_port: null
    , nonroot: false
    , servers: null
    }
  , nfsForm: {}
  , nfsConfigRequests: new Set()
  , configureNFSTaskRequests: new Set()
  , toggleNFSTaskRequests: new Set()
  , toggleNFSTasv4kRequests: new Set()
  , configureNFSTasks: new Set()
  , toggleNFSTasks: new Set()
  , toggleNFSv4Tasks: new Set()
  };

export default function nfs ( state = INITIAL_STATE, action ) {
  const { payload, error, type } = action;

  var nfsServerState, nfsForm, nfsConfigRequests;

  switch ( type ) {
    // FORM
    case TYPES.UPDATE_NFS_FORM:
      nfsForm = Object.assign( {}, state.nfsForm );
      nfsForm[ payload.field ] = payload.value;
    return Object.assign( {}, state, { nfsForm } );

    case TYPES.RESET_NFS_FORM:
      return Object.assign( {}, state, { nfsForm: {} } );

    // QUERIES
    case TYPES.NFS_CONFIG_REQUEST:
      return Object.assign( {}
                          , state
                          , recordUUID( payload.UUID
                                      , state
                                      , "nfsConfigRequests"
                                      )
                          );

    // TASKS
    case TYPES.CONFIGURE_NFS_TASK_REQUEST:
      return Object.assign( {}
                          , state
                          , recordUUID( payload.UUID
                                      , state
                                      , "configureNFSTaskRequests"
                                      )
                          );
    case TYPES.TOGGLE_NFS_TASK_REQUEST:
      return Object.assign( {}
                          , state
                          , recordUUID( payload.UUID
                                      , state
                                      , "toggleNFSTaskRequests"
                                      )
                          );

    case TYPES.TOGGLE_NFS_V4_TASK_REQUEST:
      return Object.assign( {}
                          , state
                          , recordUUID( payload.UUID
                                      , state
                                      , "toggleNFSv4TaskRequests"
                                      )
                          );

    // RPC Handling
    case TYPES.RPC_TIMEOUT:
    case TYPES.RPC_FAILURE:
    case TYPES.RPC_SUCCESS:

      if ( state.nfsConfigRequests.has( payload.UUID ) ) {
        nfsServerState = Object.assign( {}
                                      , state.nfsServerState
                                      , payload.data
                                      );
        return Object.assign( {}, state, { nfsServerState }
                            , resolveUUID( payload.UUID
                                         , state
                                         , "nfsConfigRequests"
                                         )
                            );
      } else {
        return state;
      }

    case TYPES.ENTITY_CHANGED:
      if ( payload.mask === "service.changed"
        && payload.data.entities[0].name === "nfs"
         ) {
        nfsServerState = Object.assign( {}
                                      , state.nfsServerState
                                      , payload.data.entities[0].config
                                      );
        return Object.assign( {}, state , { nfsServerState } );
      } else {
        return state;
      }

    // TODO: TASK HANDLING

    default:
      return state;
  }
};
