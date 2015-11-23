// AFP ACTION CREATORS
// ====================
// afp namespace

"use strict";

import { UPDATE_AFP_FORM
       , RESET_AFP_FORM
       , AFP_CONFIG_REQUEST
       , CONFIGURE_AFP_TASK_REQUEST
       , TOGGLE_AFP_TASK_REQUEST
       }
  from "./actionTypes";
import MiddlewareClient from "../websocket/MiddlewareClient";

import { watchRequest } from "../utility/Action";
import MC from "../websocket/MiddlewareClient";

// FORM
export function updateAFPForm ( field, value ) {
  return (
    { type: UPDATE_AFP_FORM
    , payload: { field: field
               , value: value
               }
    }
  );
}

export function resetAFPForm () {
  return (
    { type: RESET_AFP_FORM }
  );
}

// QUERY
export function requestAFPConfig () {
  return ( dispatch ) => {
    MC.request( "service.get_service_config"
              , [ "afp" ]
              , ( UUID ) => dispatch( watchRequest( UUID, AFP_CONFIG_REQUEST ) )
              );
  };
};


// TASKS
export function configureAFPTaskRequest () {
  return ( dispatch, getState ) => {
    const state = getState();
    var formToSubmit = Object.assign( {}, state.afp.afpForm );
    var connections_limit = formToSubmit.connections_limit;

    if ( typeof connections_limit === "string" ) {
      connections_limit = Number.parseInt( connections_limit );
      if ( !Number.isInteger( connections_limit ) ) {
        throw new Error( "Attempted to submit an invalid connections_limit"
                       + " value for AFP."
                       );
      } else {
        formToSubmit.connections_limit = connections_limit;
      }
    }

    MC.submitTask( [ "service.configure", [ "afp", formToSubmit ] ]
                 , ( UUID ) => dispatch( watchRequest
                                       , CONFIGURE_AFP_TASK_REQUEST
                                       )
                 );
  };
};

export function toggleAFPTaskRequest () {
  return ( dispatch, getState ) =>{
    const state = getState();
    MC.submitTask( [ "service.configure"
                   , [ "afp", { enable: !state.afp.afpServerState.enable } ]
                   ]
                   , ( UUID ) => dispatch( watchRequest
                                         , TOGGLE_AFP_TASK_REQUEST
                                         )
                   );
  }
};
