// NETWORK - REDUCER
// =================

"use strict";

import * as TYPES from "../actions/actionTypes";
import { recordUUID, resolveUUID } from "../utility/Reducer";

const INITIAL_STATE =
  { configQueryRequests: new Set()
  , configTaskRequests: new Set()
  , activeConfigTasks: new Set()
  , serverConfig:
    { http_proxy: null
    , autoconfigure: false
    , netwait:
      { enabled: false
      , addresses: []
      }
    , dns:
      { search: []
      , addresses: []
      }
    , dhcp:
      { assign_gateway: true
      , assign_dns: true
      }
    , gateway:
      { ipv4: null
      , ipv6: null
      }
    }

  , clientConfig: {}
  };

export default function disks ( state = INITIAL_STATE, action ) {
  const { payload, error, type } = action;
  let clientConfig;
  let activeConfigTasks;

  switch( type ) {
    case TYPES.UPDATE_NETWORK_CONFIG:
      clientConfig = Object.assign( {}, state.clientConfig );
      _.set( clientConfig, payload.path, payload.value );
      return Object.assign( {}, state, { clientConfig } );

    case TYPES.REVERT_NETWORK_CONFIG:
      return Object.assign( {}, state, { clientConfig: {} } );


  // RPC AND TASK ACTIONS
  // ====================

    // GET NETWORK CONFIGURATION
    case TYPES.NETWORK_CONFIG_REQUEST:
      return Object.assign( {}
                          , state
                          , recordUUID( payload.UUID, state, "configQueryRequests" )
                          );

    case TYPES.NETWORK_CONFIGURE_TASK_SUBMIT:
      return Object.assign( {}
                          , state
                          , recordUUID( payload.UUID, state, "configTaskRequests" )
                          );

    // RPC REQUEST RESOLUTION
    case TYPES.RPC_SUCCESS:
    case TYPES.RPC_FAILURE:
    case TYPES.RPC_TIMEOUT:
      if ( state.configQueryRequests.has( payload.UUID ) ) {
        if ( payload.data ) {
          return Object.assign( {}
                              , state
                              , resolveUUID( payload.UUID, state, "configQueryRequests" )
                              , { serverConfig: payload.data }
                              );
        } else {
          return state;
        }
      }

      if ( state.configTaskRequests.has( payload.UUID ) ) {
        if ( payload.data ) {
          return Object.assign( {}
                              , state
                              , resolveUUID( payload.UUID, state, "configTaskRequests" )
                              );
        } else {
          return state;
        }
      }

    // TRACK ACTIVE TASKS
    case TYPES.TASK_CREATED:
    case TYPES.TASK_UPDATED:
    case TYPES.TASK_PROGRESS:
      if ( payload.data // another truthiness check
        && typeof payload.data === "object"
        && payload.data.hasOwnProperty( "name" )
        && payload.data.name === "network.configure"
        ) {
        activeConfigTasks = new Set( state.activeConfigTasks );
        activeConfigTasks.add( payload.data.id );
        return Object.assign( {}, state, { activeConfigTasks } );
      }
      return state;

    case TYPES.TASK_FINISHED:
    case TYPES.TASK_FAILED:
      if ( payload.data // check for null before checking for typeof is "object"
        && typeof payload.data === "object"
        && payload.data.hasOwnProperty( "name" )
        && payload.data.name === "network.configure"
        ) {
        activeConfigTasks = new Set( state.activeConfigTasks );
        activeConfigTasks.delete( payload.data.id );
        return Object.assign( {}, state, { activeConfigTasks } );
      }
      return state;


    default:
      return state;
  }
}
