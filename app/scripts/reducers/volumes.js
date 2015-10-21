// VOLUMES - REDUCER
// =================

"use strict";

import * as actionTypes from "../actions/actionTypes";


// DATASET NAME BLACKLIST
// This set represents all of the strings and regexps that should be blacklisted
// by the GUI in most situations
const DATASET_NAME_BLACKLIST = new Set(
  [ "iocage"
  , /^\./
  ]
);

const INITIAL_STATE =
  { isFetchingVolumes: false
  , isFetchingAvailableDisks: false
  , errorForVolumes: null
  , errorForAvailableDisks: null
  , volumes: {}
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

  switch ( type ) {
    // VOLUMES
    case actionTypes.VOLUMES_RPC_REQUEST:
      return Object.assign( {}, state, { isFetchingVolumes: true } );

    case actionTypes.VOLUMES_RPC_SUCCESS:
      return Object.assign( {}, state,
        { isFetchingVolumes: false
        , volumes: normalizeVolumes( payload.volumes )
        }
      );

    case actionTypes.VOLUMES_RPC_FAILURE:
      return Object.assign( {}, state,
        { isFetchingVolumes: false
        , errorForVolumes: payload
        }
      );

    // AVAILABLE DISKS
    case actionTypes.AVAILABLE_DISKS_RPC_REQUEST:
      return Object.assign( {}, state, { isFetchingAvailableDisks: true } );

    case actionTypes.AVAILABLE_DISKS_RPC_SUCCESS:
      return Object.assign( {}, state,
        { isFetchingAvailableDisks: false
        , availableDisks: new Set( payload.availableDisks )
        }
      );

    case actionTypes.AVAILABLE_DISKS_RPC_FAILURE:
      return Object.assign( {}, state,
        { isFetchingAvailableDisks: false
        , errorForAvailableDisks: payload
        }
      );

    default:
      return state;
  }
}
