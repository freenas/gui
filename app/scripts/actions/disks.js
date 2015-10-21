// DISKS - ACTION CREATORS
// =======================

"use strict";

import * as actionTypes from "./actionTypes";
import MC from "../websocket/MiddlewareClient";


// SUBSCRIPTION
export function subscribe ( componentID ) {
  MC.subscribe( [ "entity-subscriber.disks.changed" ], componentID );
}

export function unsubscribe ( componentID ) {
  MC.unsubscribe( [ "entity-subscriber.disks.changed" ], componentID );
}


// DISK OVERVIEW
function diskOverviewRequest () {
  return { type: actionTypes.DISK_OVERVIEW_REQUEST };
}

function diskOverviewSuccess ( reqID, args, timestamp ) {
  return (
    { type: actionTypes.DISK_OVERVIEW_SUCCESS
    , payload: { disks: args }
    }
  );
}

function diskOverviewFailure ( reqID, args, timestamp ) {
  return (
    { type: actionTypes.DISK_OVERVIEW_FAILURE
    , error: true
    , payload: new Error( args )
    }
  );
}

export function requestDiskOverview () {
  return ( dispatch, getState ) => {
    MC.request( "disks.get_disk_config"
              , [ diskPath ]
              , ( reqID, args, timestamp ) =>
                dispatch( diskOverviewSuccess( reqID, args, timestamp ) )
              , ( reqID, args, timestamp ) =>
                dispatch( diskOverviewFailure( reqID, args, timestamp ) )
              );

    return dispatch( diskOverviewRequest() );
  }
}
