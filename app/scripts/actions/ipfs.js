// IPFS ACTION CREATORS
// ====================
// ipfs namespace

"use strict";

import { UPDATE_IPFS_FORM
       , RESET_IPFS_FORM
       , IPFS_CONFIG_REQUEST
       , CONFIGURE_IPFS_TASK_REQUEST
       , TOGGLE_IPFS_TASK_REQUEST
       }
  from "./actionTypes";
import MiddlewareClient from "../websocket/MiddlewareClient";

import { watchRequest } from "../utility/Action";
import MC from "../websocket/MiddlewareClient";

// FORM
export function updateIPFSForm ( field, value ) {
  return (
    { type: UPDATE_IPFS_FORM
    , payload: { field: field
               , value: value
               }
    }
  );
}

export function resetIPFSForm () {
  return (
    { type: RESET_IPFS_FORM }
  );
}

// QUERY
export function requestIPFSConfig () {
  return ( dispatch ) => {
    MC.request( "service.get_service_config"
              , [ "ipfs" ]
              , ( UUID ) => dispatch( watchRequest( UUID, IPFS_CONFIG_REQUEST ) )
              );
  };
};


// TASKS
export function configureIPFSTaskRequest () {
  return ( dispatch, getState ) => {
    const state = getState();
    var formToSubmit = Object.assign( {}, state.ipfs.ipfsForm );

    MC.submitTask( [ "service.configure", [ "ipfs", formToSubmit ] ]
                 , ( UUID ) => dispatch( watchRequest
                                       , CONFIGURE_IPFS_TASK_REQUEST
                                       )
                 );
  };
};

export function toggleIPFSTaskRequest () {
  return ( dispatch, getState ) =>{
    const state = getState();
    MC.submitTask( [ "service.configure"
                   , [ "ipfs", { enable: !state.ipfs.ipfsServerState.enable } ]
                   ]
                   , ( UUID ) => dispatch( watchRequest
                                         , TOGGLE_IPFS_TASK_REQUEST
                                         )
                   );
  }
};
