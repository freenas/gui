// VOLUMES - ACTIONS
// =================

"use strict";

import { VOLUMES_RPC_REQUEST, AVAILABLE_DISKS_RPC_REQUEST }
  from "./actionTypes";
import { watchRequest } from "../utility/Action";
import MC from "../websocket/MiddlewareClient";


// VOLUMES REQUEST
export function fetchVolumes () {
  return ( dispatch, getState ) => {
    MC.request( "volumes.query"
              , []
              , ( UUID ) =>
                dispatch( watchRequest( UUID, VOLUMES_RPC_REQUEST ) )
              );
  }
}

// AVAILABLE DISKS REQUEST
export function fetchAvailableDisks () {
  return ( dispatch, getState ) => {
    MC.request( "volumes.get_available_disks"
              , []
              , ( UUID ) =>
                dispatch( watchRequest( UUID, AVAILABLE_DISKS_RPC_REQUEST ) )
              );
  }
}

