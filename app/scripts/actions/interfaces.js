// INTERFACES - ACTION CREATORS
// ============================

"use strict";

import { NETWORK_INTERFACES_REQUEST
       , UPDATE_INTERFACE
       , RESET_INTERFACE
       , INTERFACE_CONFIGURE_TASK_SUBMIT
       , TOGGLE_INTERFACE_TASK_SUBMIT
       }
  from "./actionTypes";
import { watchRequest } from "../utility/Action";
import MC from "../websocket/MiddlewareClient";

// QUERIES
export function requestNetworkInterfaces () {
  return ( dispatch ) => {
    MC.request( "network.interfaces.query"
              , null
              , ( UUID ) =>
                dispatch( watchRequest( UUID, NETWORK_INTERFACES_REQUEST ) )
              );
  }
};

// EDITING

export function updateInterface ( interfaceID, path, value ) {
  return ( dispatch ) =>
    dispatch( { type: UPDATE_INTERFACE
              , payload: { interfaceID, path, value }
              }
            );
};

export function resetInterface ( interfaceID ) {
  return ( dispatch ) =>
    dispatch( { type: RESET_INTERFACE
              , payload: { interfaceID }
              }
            );
};

// TASKS
export function toggleInterfaceTaskRequest ( interfaceID ) {
  return ( dispatch, getState ) => {
    const state = getState().freeze;
    MC.submitTask( [ "network.interface.configure"
                   , state.interfaces.interfaces[ interfaceID ].enabled
                   ? [ interfaceID, { enabled: false } ]
                   : [ interfaceID, { enabled: true } ]
                   ]
                 , ( UUID ) => dispatch( watchRequest
                                       , TOGGLE_INTERFACE_TASK_SUBMIT
                                       )
                 );
  }
};

export function configureInterfaceTaskRequest ( interfaceID ) {
  return ( dispatch, getState ) => {
    const state = getState().freeze;
    MC.submitTask( [ "network.interface.configure"
                   , [ interfaceID
                     , state.interfaces.interfaceChanges[ interfaceID ]
                     ]
                   ]
                 , ( UUID ) => dispatch( watchRequest
                                       , INTERFACE_CONFIGURE_TASK_SUBMIT
                                       )
                 );
  }
};
