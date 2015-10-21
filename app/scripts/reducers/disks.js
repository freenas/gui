// DISKS REDUCER
// =============

"use strict";

import * as actionTypes from "../actions/actionTypes";
import ByteCalc from "../utility/ByteCalc";

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
  { isFetching: false
  , fetchError: false
  , disks: {}
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

  switch( type ) {
    case actionTypes.DISK_OVERVIEW_REQUEST:
      return Object.assign( {}, state, { isFetching: true } );

    case actionTypes.DISK_OVERVIEW_SUCCESS:
      return Object.assign( {}, state,
        { isFetching: false
        , disks: destructureDisks( state.disks, payload.disks )
        }
      );

    case actionTypes.DISK_OVERVIEW_FAILURE:
      return Object.assign( {}, state,
        { isFetching: false
        , fetchError: payload
        } );

    default:
      return state;
  }
}
