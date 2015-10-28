// RPC - REDUCER
// =============

"use strict";

import * as TYPES from "../actions/actionTypes";

const INITIAL_STATE =
  { queued: []
  , pending: {}
  , failure: {}
  , timeout: {}
  };

export default function rpc ( state = INITIAL_STATE, action ) {
  const { payload, error, type } = action;
  let queued, pending, failure, timeout;

  switch ( type ) {

    // RPC QUEUE
    // Since requests may be blindly made by React components while the
    // WebSocket connection is disconnected or the session is not authenticated,
    // we place those requests in a FIFO queue to be resolved once the socket is
    // open and the user is logged in.


    // ENQUEUE
    // Place a single request in the end of the queue
    case TYPES.RPC_ENQUEUE:
      queued = state.queued;
      queued.push( action.payload );
      return Object.assign( {}, state, { queued } );


    // REQUESTS WERE DEQUEUED
    // This action is dispatched by MiddlewareClient when it is ready to dequeue
    // all stored requests. As such, we reset `rpc.queued` to an empty array.
    case TYPES.RPC_DEQUEUE:
      return Object.assign( {}, state, { queued: [] } );


    // RPC LIFECYCLE
    // Track the lifecycle of middleware RPCs. Any other reducer which wishes to
    // track a request should submit a callback to MiddlewareClient's
    // `request()`. The callback will receive the UUID of the request, which
    // can then be used as a key against `rpc.pending`, `rpc.failure`,
    // or `rpc.timeout`. The `rpc` reducer is then the single source of truth
    // for all RPC information.


    // REQUEST
    // This action is automatically dispatched by the MiddlewareClient after an
    // RPC request has been sent over the WebSocket connection. This reducer
    // will receive the full content of the request, including its RPC method,
    // arguments, and UUID.
    case TYPES.RPC_REQUEST:
      pending = Object.assign( {}, state.pending,
        { [ payload.UUID ]: payload }
      );

      return Object.assign( {}, state, { pending } );


    // RPC COMPLETE: SUCCESS
    // Since any meaningful outcome of an RPC will be tracked either as a task
    // or emit an event, it is no longer necessary to hold state information
    // about an RPC which has completed successfully. We delete the key.
    case TYPES.RPC_SUCCESS:
      pending = Object.assign( {}, state.pending );

      delete pending[ payload.UUID ];

      return Object.assign( {}, state,
        { pending: Object.assign( {}, state.pending, pending ) }
      );


    // RPC COMPLETE: FAILURE
    // This outcome indicates a problem with the RPC. This should not be
    // confused with a middleware exception, which doesn't return on the `rpc`
    // namespace. Usually this signifies a problem with the format of the RPC
    // itself, or the arguments thereof. Because of this potential significance,
    // the key is migrated to `rpc.failure` for debugging, error display, and
    // subsequent manual cleanup. If that seems burdensome or annoying, that's
    // because it's supposed to be - we want these errors to be loud so that we
    // can catch them early and prevent them from happening.
    case TYPES.RPC_FAILURE:
      pending = Object.assign( {}, state.pending );
      failure = Object.assign( {}, state.failure
        , { [ payload.UUID ]: pending[ payload.UUID ] }
        , { [ payload.UUID ]: payload }
      );

      delete pending[ payload.UUID ];

      return Object.assign( {}, state, { pending, failure });


    // RPC COMPLETE: TIMEOUT
    // The timeout action is dispatched when an RPC did not recieve a response
    // in the allotted time. By default, this is relatively low, so if your
    // call is known to take a long time, consider supplying a higher timeout
    // interval.
    case TYPES.RPC_TIMEOUT:
      pending = Object.assign( {}, state.pending );
      timeout = Object.assign( {}, state.timeout
        , { [ payload.UUID ]: pending[ payload.UUID ] }
        , { [ payload.UUID ]: payload }
      );

      delete pending[ payload.UUID ];

      return Object.assign( {}, state, { pending, timeout });


    // RESOLVE RPC
    // This is a cleanup action, and the only result is that we delete all keys
    // that may have ever been stored for the provided UUID. This is the correct
    // way to clean up a failure or timeout - consider having an "OK" button or
    // similar dispatch this event.
    case TYPES.RPC_RESOLVE:
      pending = Object.assign( {}, state.pending );
      failure = Object.assign( {}, state.failure );
      timeout = Object.assign( {}, state.timeout );

      delete pending[ payload.UUID ];
      delete failure[ payload.UUID ];
      delete timeout[ payload.UUID ];

      return Object.assign( {}, state, { pending, failure, timeout } );


    default:
      return state;
  }
}
