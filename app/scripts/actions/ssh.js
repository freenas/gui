// SSH ACTION CREATORS
// ===================
// ssh namespace

"use strict";
import { UPDATE_SSH_FORM
       , RESET_SSH_FORM
       , SSH_CONFIG_REQUEST
       , CONFIGURE_SSH_TASK_REQUEST
       , TOGGLE_SSH_TASK_REQUEST
     }
  from "./actionTypes";
import { watchRequest } from "../utility/Action";
import MC from "../websocket/MiddlewareClient";


// FORM
export function updateSSHForm ( field, value ) {
  return ( { type: UPDATE_SSH_FORM
           , payload: { field: field
                      , value: value
                      }
           }
         );
};

export function resetSSHForm () {
  return ( { type: RESET_SSH_FORM } );
};

// QUERY
export function requestSSHConfig () {
  return ( dispatch ) => {
    MC.request( "service.ssh.get_config"
              , []
              , ( UUID ) => dispatch( watchRequest( UUID, SSH_CONFIG_REQUEST ) )
              );
  };
};


// TASKS
export function configureSSHTaskRequest () {
  return ( dispatch, getState ) => {
    const state = getState();
    MC.submitTask( [ "service.ssh.configure", [ state.ssh.sshForm ] ]
                 , ( UUID ) => dispatch( watchRequest
                                       , CONFIGURE_SSH_TASK_REQUEST
                                       )
                 );
  };
};

export function toggleSSHTaskRequest () {
  return ( dispatch, getState ) =>{
    const state = getState();
    MC.submitTask( [ "service.configure"
                   , state.ssh.sshServerState.enable
                   ? [ "sshd", { enable: false } ]
                   : [ "sshd", { enable: true } ]
                   ]
                   , ( UUID ) => dispatch( watchRequest
                                        , TOGGLE_SSH_TASK_REQUEST
                                        )
                   )
  }
}
