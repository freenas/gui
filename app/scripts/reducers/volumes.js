// VOLUMES - REDUCER
// =================

"use strict";

import * as TYPES from "../actions/actionTypes";
import { recordUUID, resolveUUID } from "../utility/Reducer";

// DATASET NAME BLACKLIST
// This set represents all of the strings and regexps that should be blacklisted
// by the GUI in most situations
const DATASET_NAME_BLACKLIST = new Set(
  [ "iocage"
  , /^\./
  ]
);

// NEW VOLUME
// Used to initialize the required property values for a new volume
const NEW_VOLUME =
  { name: ""
  , topology:
    { data  : []
    , log   : []
    , cache : []
    , spare : []
    }
  , datasets: []
  , properties:
    { free      : { rawvalue: 0 }
    , allocated : { rawvalue: 0 }
    , size      : { rawvalue: 0 }
    }
  };

const INITIAL_STATE =
  { volumesRequests: new Set()
  , availableDisksRequests: new Set()
  , serverVolumes: {}
  , clientVolumes: {}
  , activeVolume: ""
  , activeShare: ""
  , volumeToDelete: ""
  , shareToDelete: { path: null, pool: null }
  , availableDisks: new Set()
  , selectedDisks: new Set()
  , DATASET_NAME_BLACKLIST
  };


function normalizeVolumes ( volumes ) {
  let normalized = {};

  volumes.forEach( volume => normalized[ volume.id ] = volume );

  return normalized;
}

export default function auth ( state = INITIAL_STATE, action ) {
  const { payload, error, type } = action;
  let newState, clientVolumes, initData;

  switch ( type ) {

    // UPDATE CLIENT CHANGES
    case TYPES.UPDATE_VOLUME:
      clientVolumes = Object.assign( {}, state.clientVolumes );

      // If the volume has no record on the client or server, initialize it
      if ( !( clientVolumes[ payload.volumeID ] && state.serverVolumes[ payload.volumeID ] ) ) {
        initData = NEW_VOLUME
      }

      clientVolumes[ payload.volumeID ] =
        Object.assign( {}, initData, clientVolumes[ payload.volumeID ], payload.patch );

      return Object.assign( {}, state, { clientVolumes } );

    // DISCARD CLIENT CHANGES
    case TYPES.REVERT_VOLUME:
      let clientVolumes = Object.assign( {}, state.clientVolumes );

      delete clientVolumes[ payload.volumeID ];

    console.log( clientVolumes );
      return Object.assign( {}, state, { clientVolumes } );


    // SUBMIT VOLUME TO SERVER
    case TYPES.SUBMIT_VOLUME:
      return;

    // GET VOLUMES ON SERVER
    case TYPES.VOLUMES_RPC_REQUEST:
      return Object.assign( {}
                          , state
                          , recordUUID( payload.UUID, state, "volumesRequests" )
                          );

    // AVAILABLE DISKS
    case TYPES.AVAILABLE_DISKS_RPC_REQUEST:
      return Object.assign( {}
                          , state
                          , recordUUID( payload.UUID, state, "availableDisksRequests" )
                          );


    // RPC REQUEST RESOLUTION
    case TYPES.RPC_SUCCESS:
    case TYPES.RPC_FAILURE:
    case TYPES.RPC_TIMEOUT:
      // HANDLE VOLUMES DATA
      if ( state.volumesRequests.has( payload.UUID ) ) {
        if ( payload.data ) {
          newState = { serverVolumes: normalizeVolumes( payload.data ) };
        }

        return Object.assign( {}
                            , state
                            , resolveUUID( payload.UUID, state, "volumesRequests" )
                            , newState
                            );
      }

      // HANDLE AVAILABLE DISKS
      if ( state.availableDisksRequests.has( payload.UUID ) ) {
        if ( payload.data ) {
          newState = { availableDisks: new Set( payload.data ) };
        }

        return Object.assign( {}
                            , state
                            , resolveUUID( payload.UUID, state, "availableDisksRequests" )
                            , newState
                            );
      }

    default:
      return state;
  }
}
