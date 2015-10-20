// FREENAS MIDDLEWARE CONNECTION - REDUCER
// =======================================

"use strict";

import * as actionTypes from "../actions/actionTypes";

const RECONNECT_INTERVALS = [ 0, 5000, 8000, 13000, 21000, 34000 ];

const READY_STATE =
  { 0: "CONNECTING"
  , 1: "OPEN"
  , 2: "CLOSING"
  , 3: "CLOSED"
  };

const INITIAL_STATE =
  { shouldReconnect: false
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

function getSIDMessage ( state, readyState ) {
  switch ( readyState ) {
    case 0:
      return `Connecting`;

    case 2:
      return `Disconnected`;

    case 3:
      return `Re-establishing connection`;

    default:
      return "";
  }
}

function determineInterval ( attempts ) {
  // Return the stepped interval in miliseconds appropriate for the number of
  // attempted reconnects. If there have been more reconnects than defined
  // intervals, return the last available interval.
  if ( attempts <= RECONNECT_INTERVALS.length ) {
    return RECONNECT_INTERVALS[ attempts ];
  } else {
    return RECONNECT_INTERVALS[ RECONNECT_INTERVALS.length - 1 ];
  }
}

export default function auth ( state = INITIAL_STATE, action ) {
  const { payload, error, type } = action;

  switch( type ) {
    case actionTypes.ATTEMPT_CONNECTION:
      return Object.assign( {}, state,
        { connectionAttempts: state.connectionAttempts + 1
        // Reset this flag when a connection is being attempted - avoids
        // flapping any listeners or handlers that depend on its value
        , shouldReconnect: false
        , reconnectTime: determineInterval( state.connectionAttempts )
        }
      );

    case actionTypes.RECONNECT_TICK:
      return Object.assign( {}, state,
        { reconnectTime: Math.max( 0, state.reconnectTime - 1000 )
        // Reset this flag when a connection is being attempted - avoids
        // flapping any listeners or handlers that depend on its value
        , shouldReconnect: false
        , SIDShow: true
        , SIDMessage: `Reconnecting to ${ state.host } in ${ state.reconnectTime / 1000 } seconds...`
        }
      );

    case actionTypes.WS_STATE_CHANGED:
      const NEW_READY_STATE = READY_STATE[ payload.readyState ];
      // The previous state was connecting, and the new state is closed - this
      // means either a timeout or other failure.
      const CONNECTION_FAILED = state.readyState === "CONNECTING" && NEW_READY_STATE === "CLOSED";

      return Object.assign( {}, state,
        // If the connection failed, set the reconnection flag. Otherwise,
        // retain the previous value
        { shouldReconnect: CONNECTION_FAILED || state.shouldReconnect
        , SIDShow: NEW_READY_STATE !== "OPEN"
        , SIDMessage: getSIDMessage( state, payload.readyState )
        , readyState: NEW_READY_STATE
        // When the connection opens, reset the connection attempts counter. If
        // the connection is in another state, preserve the previous value.
        , connectionAttempts:  NEW_READY_STATE === "OPEN"
                            ? 0
                            : state.connectionAttempts
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
        { shouldReconnect: true }
      );


    default:
      return state;
  }

}
