// GLUSTER REDUCER
// ===============
// gluster namespace

"use strict";

import * as TYPES from "../actions/actionTypes";
import MiddlewareClient from "../websocket/MiddlewareClient";
import { recordUUID, resolveUUID }
  from "../utility/Reducer";

const INITIAL_STATE =
  { glusterServerState:
    { working_directory: null
    , enable: false
    }
  , glusterForm: {}
  , glusterConfigRequests: new Set()
  , configureGlusterTaskRequests: new Set()
  , toggleGlusterTaskRequests: new Set()
  , configureGlusterTasks: new Set()
  , toggleGlusterTasks: new Set()
  };


export default function gluster ( state = INITIAL_STATE, action ) {
  const { payload, error, type } = action;

  var glusterServerState, glusterForm, glusterConfigRequests;

  switch ( type ) {
    // FORM
    case TYPES.UPDATE_GLUSTER_FORM:
      glusterForm = Object.assign( {}, state.glusterForm );
      glusterForm[ payload.field ] = payload.value;
      if ( payload.value === "" ) {
        glusterForm[ payload.field ] = null;
      }
      return Object.assign( {}, state, { glusterForm } );

    case TYPES.RESET_GLUSTER_FORM:
      return Object.assign( {}, state, { glusterForm: {} } );

    // QUERIES
    case TYPES.GLUSTER_CONFIG_REQUEST:
      return Object.assign( {}
                          , state
                          , recordUUID( payload.UUID
                                      , state
                                      , "glusterConfigRequests"
                                      )
                          );

    // TASKS
    case TYPES.CONFIGURE_GLUSTER_TASK_REQUEST:
      return Object.assign( {}
                          , state
                          , recordUUID( payload.UUID
                                      , state
                                      , "configureGlusterTaskRequests"
                                      )
                          );
    case TYPES.TOGGLE_GLUSTER_TASK_REQUEST:
      return Object.assign( {}
                          , state
                          , recordUUID( payload.UUID
                                      , state
                                      , "toggleGlusterTaskRequests"
                                      )
                          );

    // RPC Handling
    case TYPES.RPC_TIMEOUT:
    case TYPES.RPC_FAILURE:
    case TYPES.RPC_SUCCESS:

      if ( state.glusterConfigRequests.has( payload.UUID ) ) {
        glusterServerState = Object.assign( {}
                                          , state.glusterServerState
                                          , payload.data
                                          );
        return Object.assign( {}, state, { glusterServerState }
                            , resolveUUID( payload.UUID
                                         , state
                                         , "glusterConfigRequests"
                                         )
                            );
      } else {
        return state;
      }

    case TYPES.ENTITY_CHANGED:
      if ( payload.mask === "services.changed"
        && payload.data.entities[0].name === "glusterd"
         ) {
        glusterServerState = Object.assign( {}
                                          , state.glusterServerState
                                          , payload.data.entities[0].config
                                          );
        return Object.assign( {}, state, { glusterServerState } );
      }
      return state;

    // TODO: TASK HANDLING

    default:
      return state;
  }
};
