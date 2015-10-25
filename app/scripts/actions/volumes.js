// VOLUMES - ACTIONS
// =================

"use strict";

import * as TYPES from "./actionTypes";
import { watchRequest } from "../utility/Action";
import MC from "../websocket/MiddlewareClient";


// VOLUMES REQUEST
export function fetchVolumes () {
  return ( dispatch, getState ) => {
    MC.request( "volumes.query"
              , []
              , ( UUID ) =>
                dispatch( watchRequest( UUID, TYPES.VOLUMES_RPC_REQUEST ) )
              );
  }
}

// AVAILABLE DISKS REQUEST
export function fetchAvailableDisks () {
  return ( dispatch, getState ) => {
    MC.request( "volumes.get_available_disks"
              , []
              , ( UUID ) =>
                dispatch( watchRequest( UUID, TYPES.AVAILABLE_DISKS_RPC_REQUEST ) )
              );
  }
}

// UPDATE CLIENT VOLUME DATA
export function updateVolume ( volumeID, patch ) {
  return { type: TYPES.UPDATE_VOLUME
         , payload: { volumeID, patch }
         };
}

// REVERT CLIENT CHANGES TO VOLUME
export function revertVolume ( volumeID ) {
  return { type: TYPES.REVERT_VOLUME
         , payload: { volumeID }
         }
}

export function updateTopology ( volumeID, preferences ) {
  return { type: TYPES.UPDATE_VOLUME_TOPOLOGY
         , payload: { volumeID, preferences }
         };
}

export function revertTopology ( volumeID ) {
  return { type: TYPES.REVERT_VOLUME_TOPOLOGY
         , payload: { volumeID }
         };
}