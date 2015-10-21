// VOLUMES - ACTIONS
// =================

"use strict";

import * as actionTypes from "./actionTypes";
import MC from "../websocket/MiddlewareClient";


// SUBSCRIPTION
export function subscribe ( componentID ) {
  return ( dispatch, getState ) => {
    MC.subscribe( [ "entity-subscriber.volumes.changed" ], componentID );
  }
}

export function unsubscribe ( componentID ) {
  return ( dispatch, getState ) => {
    MC.unsubscribe( [ "entity-subscriber.volumes.changed" ], componentID );
  }
}


// VOLUMES REQUEST
function volumesRPCRequest () {
  return { type: actionTypes.VOLUMES_RPC_REQUEST };
}

function volumesRPCSuccess ( volumes, timestamp ) {
  return (
    { type: actionTypes.VOLUMES_RPC_SUCCESS
    , payload: { volumes }
    }
  );
}

function volumesRPCFailure ( args, timestamp ) {
  return (
    { type: actionTypes.VOLUMES_RPC_FAILURE
    , error: true
    , payload: new Error( args )
    }
  );
}


// AVAILABLE DISKS REQUEST
function availableDisksRPCRequest () {
  return { type: actionTypes.AVAILABLE_DISKS_RPC_REQUEST };
}

function availableDisksRPCSuccess ( availableDisks, timestamp ) {
  return (
    { type: actionTypes.AVAILABLE_DISKS_RPC_SUCCESS
    , payload: { availableDisks }
    }
  );
}

function availableDisksRPCFailure ( args, timestamp ) {
  return (
    { type: actionTypes.AVAILABLE_DISKS_RPC_FAILURE
    , error: true
    , payload: new Error( args )
    }
  );
}


export function fetchVolumes () {
  return ( dispatch, getState ) => {
    MC.request( "volumes.query"
              , []
              , ( args, timestamp ) =>
                dispatch( volumesRPCSuccess( args, timestamp ) )
              , ( args, timestamp ) =>
                dispatch( volumesRPCFailure( args, timestamp ) )
              );

    return dispatch( volumesRPCRequest() );
  }
}

export function fetchAvailableDisks () {
  return ( dispatch, getState ) => {
    MC.request( "volumes.get_available_disks"
              , []
              , ( args, timestamp ) =>
                dispatch( availableDisksRPCSuccess( args, timestamp ) )
              , ( args, timestamp ) =>
                dispatch( availableDisksRPCFailure( args, timestamp ) )
              );

    return dispatch( availableDisksRPCRequest() );
  }
}

