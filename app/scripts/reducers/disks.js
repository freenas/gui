// DISKS REDUCER
// =============

"use strict";

import * as TYPES from "../actions/actionTypes";
import DiskUtilities from "../utility/DiskUtilities";
import { recordUUID, resolveUUID } from "../utility/Reducer";

const DISK_LABELS =
  { serial: "Serial"
  , humanSize: "Capacity"
  , online: "Disk Online"
  , path: "Path"
  , sectorsize: "Sector Size"
  , max_rotation: "Maximum RPM"
  , smart_enabled: "S.M.A.R.T. Enabled"
  , smart_status: "S.M.A.R.T. Status"
  , model: "Disk Model"
  , schema: "Partition Format"
  };

const INITIAL_STATE =
  { disksOverviewRequests: new Set()
  , fetchError: false
  , disks: {}
  , SSDs: new Set()
  , HDDs: new Set()
  , selectedDisks: new Set()
  , DISK_LABELS
  };


function destructureDisks ( client, server ) {
  let destructured = {};

  server.forEach( disk => destructured[ disk.path ] = disk );

  return Object.assign( {}, client, destructured );
}


export default function disks ( state = INITIAL_STATE, action ) {
  const { payload, error, type } = action;
  let disks;
  let pathsByType;

  switch( type ) {
    case TYPES.DISK_OVERVIEW_REQUEST:
      return Object.assign( {}
                          , state
                          , recordUUID( payload.UUID, state, "disksOverviewRequests" )
                          );

    // RPC REQUEST RESOLUTION
    case TYPES.RPC_SUCCESS:
    case TYPES.RPC_FAILURE:
    case TYPES.RPC_TIMEOUT:
      // HANDLE VOLUMES DATA
      if ( state.disksOverviewRequests.has( payload.UUID ) ) {
        if ( payload.data ) {
          disks = destructureDisks( null, payload.data );
          pathsByType = DiskUtilities.splitDiskTypes( disks );

          return Object.assign( {}
                              , state
                              , resolveUUID( payload.UUID, state, "volumesRequests" )
                              , { disks
                                , SSDs: new Set( pathsByType[0] )
                                , HDDs: new Set( pathsByType[1] )
                                }
                              );
        } else {
          console.warn( "Disks overview query did not return any data" );
        }
        return state;
      }

    default:
      return state;
  }
}
