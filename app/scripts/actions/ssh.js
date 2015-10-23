// SSH ACTION CREATORS
// ===================
// ssh namespace

"use strict";

import * as TYPES from "./actionTypes";
import MC from "../websocket/MiddlewareClient";


// FORM
export function updateSSHForm ( field, value ) {
  return ( { type: TYPES.UPDATE_SSH_FORM
           , payload: { field: field
                      , value: value
                      }
           }
         );
};

export function resetSSHForm () {
  return ( { type: TYPES.RESET_SSH_FORM } );
};


// QUERY
function sshConfigRequest ( UUID ) {
  return { type: TYPES.SSH_CONFIG_REQUEST
         , payload: { UUID }
         };
};

export function requestSSHConfig () {
  return ( dispatch ) => {
    MC.request( "service.ssh.get_config"
              , []
              , ( UUID ) => dispatch( sshConfigRequest( UUID ) )
              );
  };
};


// TASKS
export function submitSSHForm () {
  return ( { type: TYPES.SUBMIT_SSH_FORM
           , payload: {}
           }
         );
};
