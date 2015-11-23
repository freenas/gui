// GLUSTER ACTION CREATORS
// ====================
// gluster namespace

"use strict";

import { UPDATE_GLUSTER_FORM
       , RESET_GLUSTER_FORM
       , GLUSTER_CONFIG_REQUEST
       , CONFIGURE_GLUSTER_TASK_REQUEST
       , TOGGLE_GLUSTER_TASK_REQUEST
       }
  from "./actionTypes";
import MiddlewareClient from "../websocket/MiddlewareClient";

import { watchRequest } from "../utility/Action";
import MC from "../websocket/MiddlewareClient";

// FORM
export function updateGlusterForm ( field, value ) {
  return (
    { type: UPDATE_GLUSTER_FORM
    , payload: { field: field
               , value: value
               }
    }
  );
}

export function resetGlusterForm () {
  return (
    { type: RESET_GLUSTER_FORM }
  );
}

// QUERY
export function requestGlusterConfig () {
  return ( dispatch ) => {
    MC.request( "service.get_service_config"
              , [ "glusterd" ]
              , ( UUID ) => dispatch( watchRequest( UUID, GLUSTER_CONFIG_REQUEST ) )
              );
  };
};


// TASKS
export function configureGlusterTaskRequest () {
  return ( dispatch, getState ) => {
    const state = getState();
    var formToSubmit = Object.assign( {}, state.gluster.glusterForm );

    MC.submitTask( [ "service.configure", [ "glusterd", formToSubmit ] ]
                 , ( UUID ) => dispatch( watchRequest
                                       , CONFIGURE_GLUSTER_TASK_REQUEST
                                       )
                 );
  };
};

export function toggleGlusterTaskRequest () {
  return ( dispatch, getState ) =>{
    const state = getState();
    MC.submitTask( [ "service.configure"
                   , [ "glusterd", !state.gluster.glusterServerState.enable ]
                   ]
                   , ( UUID ) => dispatch( watchRequest
                                         , TOGGLE_GLUSTER_TASK_REQUEST
                                         )
                   );
  }
};
