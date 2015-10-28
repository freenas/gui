// RPC - ACTION CREATORS
// =====================

"use strict";

import * as TYPES from "./actionTypes";

// QUEUE MANAGEMENT

// Many views' lifecycle will make a request before the connection is made,
// and before the login credentials have been accepted. In this case, we will
// store the requests in a FIFO queue, and resolve them once the session
// becomes authenticated
export function enqueueRPCRequest ( request ) {
  return { type: TYPES.RPC_ENQUEUE
         , payload: { ...request }
         }
}

// This action should be dispatched when the MiddlewareClient will resolve
// the request queue. All requests should be dequeued at the same time.
export function dequeueRPCRequests () {
  return { type: TYPES.RPC_DEQUEUE }
}


// REQUEST LIFECYCLE
export function submitRPCRequest ( UUID, params ) {
  return { type: TYPES.RPC_REQUEST
         , payload: { UUID, params }
         }
}

export function submitRPCSuccess ( UUID, data ) {
  return { type: TYPES.RPC_SUCCESS
         , payload: { UUID, data }
         }
}

export function submitRPCFailure ( UUID, error ) {
  return { type: TYPES.RPC_FAILURE
         , error: true
         , payload: { UUID, error }
         }
}

export function submitRPCTimeout ( UUID, error ) {
  return { type: TYPES.RPC_TIMEOUT
         , error: true
         , payload: { UUID, error }
         }
}

export function submitRPCResolve ( UUID ) {
  return { type: TYPES.RPC_RESOLVE
         , payload: { UUID }
         }
}
