// DISKS - ACTION CREATORS
// =======================

"use strict";

import * as actionTypes from "./actionTypes";
import MC from "../websocket/MiddlewareClient";


// SUBSCRIPTION
export function subscribe ( componentID ) {
  return ( dispatch, getState ) => {
    MC.subscribe( [ "entity-subscriber.disks.changed" ], componentID );
  }
}

export function unsubscribe ( componentID ) {
  return ( dispatch, getState ) => {
    MC.unsubscribe( [ "entity-subscriber.disks.changed" ], componentID );
  }
}


// DISK OVERVIEW
function diskOverviewRequest () {
  return { type: actionTypes.DISK_OVERVIEW_REQUEST };
}

function diskOverviewSuccess ( disks, timestamp ) {
  return (
    { type: actionTypes.DISK_OVERVIEW_SUCCESS
    , payload: { disks }
    }
  );
}

function diskOverviewFailure ( args, timestamp ) {
  return (
    { type: actionTypes.DISK_OVERVIEW_FAILURE
    , error: true
    , payload: new Error( args )
    }
  );
}

export function requestDiskOverview () {
  return ( dispatch, getState ) => {
    MC.request( "disks.query"
              , []
              , ( args, timestamp ) =>
                dispatch( diskOverviewSuccess( args, timestamp ) )
              , ( args, timestamp ) =>
                dispatch( diskOverviewFailure( args, timestamp ) )
              );

    return dispatch( diskOverviewRequest() );
  }
}
