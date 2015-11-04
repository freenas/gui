// SMB ACTION CREATORS
// ====================
// smb namespace

"use strict";

import { UPDATE_SMB_FORM
       , RESET_SMB_FORM
       , SMB_CONFIG_REQUEST
       , CONFIGURE_SMB_TASK_REQUEST
       , TOGGLE_SMB_TASK_REQUEST
       }
  from "./actionTypes";
import MiddlewareClient from "../websocket/MiddlewareClient";

import { watchRequest } from "../utility/Action";
import MC from "../websocket/MiddlewareClient";

// FORM
export function updateSMBForm ( field, value ) {
  return (
    { type: UPDATE_SMB_FORM
    , payload: { field: field
               , value: value
               }
    }
  );
}

export function resetSMBForm () {
  return (
    { type: RESET_SMB_FORM }
  );
}

// QUERY
export function requestSMBConfig () {
  return ( dispatch ) => {
    MC.request( "services.get_service_config"
              , [ "cifs" ]
              , ( UUID ) => dispatch( watchRequest( UUID, SMB_CONFIG_REQUEST ) )
              );
  };
};


// TASKS
export function configureSMBTaskRequest () {
  return ( dispatch, getState ) => {
    const state = getState();
    var formToSubmit = Object.assign( {}, state.smb.smbForm );

    // TODO: FIX service name when the time comes
    MC.submitTask( [ "service.configure", [ "cifs", formToSubmit ] ]
                 , ( UUID ) => dispatch( watchRequest
                                       , CONFIGURE_SMB_TASK_REQUEST
                                       )
                 );
  };
};

export function toggleSMBTaskRequest () {
  return ( dispatch, getState ) =>{
    const state = getState();
    MC.submitTask( [ "service.configure"
                   , [ "cifs", { enable: !state.smb.smbServerState.enable } ]
                   ]
                   , ( UUID ) => dispatch( watchRequest
                                         , TOGGLE_SMB_TASK_REQUEST
                                         )
                   );
  }
};
