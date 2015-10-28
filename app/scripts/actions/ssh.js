// SSH ACTION CREATORS
// ===================
// ssh namespace

"use strict";
import { UPDATE_SSH_FORM
       , RESET_SSH_FORM
       , SSH_CONFIG_REQUEST
       , SUBMIT_SSH_FORM
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
export function submitSSHForm () {
  return ( { type: SUBMIT_SSH_FORM
           , payload: {}
           }
         );
};
