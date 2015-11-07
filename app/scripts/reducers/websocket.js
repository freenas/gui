// FREENAS MIDDLEWARE CONNECTION - REDUCER
// =======================================

"use strict";

import { isClosureNormal } from "../websocket/WebSocketCodes";
import * as actionTypes from "../actions/actionTypes";

const RECONNECT_INTERVALS = [ 1000, 5000, 8000, 13000, 21000, 34000 ];

const INITIAL_STATE =
  { reconnectNow: false
  , SIDShow: true
  , SIDMessage: ""
  , readyState: null
  , connectionAttempts: 0
  , reconnectTime: RECONNECT_INTERVALS[0]
  , protocol: ""
  , host: ""
  , path: ""
  , mode: ""
  };

function determineInterval ( attempts ) {
  // Return the stepped interval in miliseconds appropriate for the number of
  // attempted reconnects. If there have been more reconnects than defined
  // intervals, return the last available interval.

  if ( attempts < RECONNECT_INTERVALS.length ) {
    return RECONNECT_INTERVALS[ attempts ];
  } else {
    return RECONNECT_INTERVALS[ RECONNECT_INTERVALS.length - 1 ];
  }
}

export default function websocket ( state = INITIAL_STATE, action ) {
  const { payload, error, type } = action;

  switch( type ) {

    // CONNECTION / RECONNECT HANDLING
    // ===============================
    case actionTypes.ATTEMPT_CONNECTION:
      return Object.assign( {}, state,
        { connectionAttempts: state.connectionAttempts + 1
        // Reset this flag when a connection is being attempted - avoids
        // flapping any listeners or handlers that depend on its value
        , reconnectNow: false
        , reconnectTime: determineInterval( state.connectionAttempts )
        }
      );

    case actionTypes.WS_RECONNECT_TICK:
      return Object.assign( {}, state,
        { reconnectTime: Math.max( 0, state.reconnectTime - 1000 )
        // Reset this flag when a connection is being attempted - avoids
        // flapping any listeners or handlers that depend on its value
        , reconnectNow: false
        , SIDShow: true
        , SIDMessage: `Reconnecting to ${ state.host } in ${ state.reconnectTime / 1000 } seconds...`
        }
      );


    // WEBSOCKET CONNECTION STATES
    // ===========================
    case actionTypes.WS_CONNECTING:
      return Object.assign( {}, state,
        { SIDShow: true
        , SIDMessage: `Connecting to ${ state.host }`
        , readyState: "CONNECTING"
        , reconnectNow: false
        }
      );

    case actionTypes.WS_OPEN:
      return Object.assign( {}, state,
        { SIDShow: false
        , SIDMessage: `Connected to ${ state.host }`
        // When the connection opens, reset the connection attempts counter.
        , connectionAttempts: 0
        , readyState: "OPEN"
        , reconnectNow: false
        }
      );

    case actionTypes.WS_CLOSING:
      return Object.assign( {}, state,
        { SIDShow: true
        , SIDMessage: `Disconnected from ${ state.host }`
        , readyState: "CLOSING"
        , reconnectNow: false
        }
      );

    case actionTypes.WS_CLOSED:
      return Object.assign( {}, state,
        { SIDShow: true
        , SIDMessage: `Connection to ${ state.host } is closed`
        , readyState: "CLOSED"
        // If the socket generated a normal closure, we return false. Otherwise,
        // we assume that the closure was undesirable and attempt to reconnect.
        // HACK: This needs to get changed in the future to accomodate
        // changing the connection to another host
        // , reconnectNow: !isClosureNormal( payload.code )
        , reconnectNow: true
        }
      );


    case actionTypes.WS_TARGET_CHANGED:
      return Object.assign( {}, state,
        { ...payload }
      );


    case actionTypes.LOGOUT:
      // TODO: Later on, we'll have to change this to allow connecting to
      // different hosts
      return Object.assign( {}, state,
        { reconnectNow: true }
      );


    default:
      return state;
  }

}
