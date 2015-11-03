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

// TASKS
export function toggleInterfaceTaskRequest ( interfaceID ) {
  return ( dispatch, getState ) => {
    const state = getState().freeze;
    MC.submitTask( [ state.interfaces.interfaces.id.status.link_state
                 === "LINK_STATE_UP"
                   ? "network.interface.down"
                   : "network.interface.up" // Alse used on LINK_STATE_UNKNOWN
                   ]
                 , ( UUID ) => dispatch( watchRequest
                                       , TOGGLE_INTERFACE_TASK_SUBMIT
                                       )
                 );
  }
};
