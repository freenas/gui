// SWIFT ACTION CREATORS
// =====================
// swift namespace

"use strict";

import { UPDATE_SWIFT_FORM
       , RESET_SWIFT_FORM
       , SWIFT_CONFIG_REQUEST
       , CONFIGURE_SWIFT_TASK_REQUEST
       , TOGGLE_SWIFT_TASK_REQUEST
       }
  from "./actionTypes";
import MiddlewareClient from "../websocket/MiddlewareClient";

import { watchRequest } from "../utility/Action";
import MC from "../websocket/MiddlewareClient";

// FORM
export function updateSwiftForm ( field, value ) {
  return (
    { type: UPDATE_SWIFT_FORM
    , payload: { field: field
               , value: value
               }
    }
  );
}

export function resetSwiftForm () {
  return (
    { type: RESET_SWIFT_FORM }
  );
}

// QUERY
export function requestSwiftConfig () {
  return ( dispatch ) => {
    MC.request( "services.get_service_config"
              , [ "swift" ]
              , ( UUID ) => dispatch( watchRequest( UUID, SWIFT_CONFIG_REQUEST ) )
              );
  };
};


// TASKS
export function configureSwiftTaskRequest () {
  return ( dispatch, getState ) => {
    const state = getState();
    var formToSubmit = Object.assign( {}, state.swift.swiftForm );

    MC.submitTask( [ "service.configure", [ "swift", formToSubmit ] ]
                 , ( UUID ) => dispatch( watchRequest
                                       , CONFIGURE_SWIFT_TASK_REQUEST
                                       )
                 );
  };
};

export function toggleSwiftTaskRequest () {
  return ( dispatch, getState ) =>{
    const state = getState();
    MC.submitTask( [ "service.configure"
                   , state.swift.swiftServerState.enable
                   ? [ "swift", { enable: false } ]
                   : [ "swift", { enable: true } ]
                   ]
                   , ( UUID ) => dispatch( watchRequest
                                         , TOGGLE_SWIFT_TASK_REQUEST
                                         )
                   );
  }
};
