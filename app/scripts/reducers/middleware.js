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
  { isChanging: true
  , SIDShow: true
  , SIDMessage: ""
  , readyState: null
  , connectionAttempts: 0
  , reconnectTime: 0
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
  return RECONNECT_INTERVALS[ attempts ]
    || RECONNECT_INTERVALS[ RECONNECT_INTERVALS.length - 1 ];
}

export default function auth ( state = INITIAL_STATE, action ) {
  const { payload, error, type } = action;

  switch( type ) {
    case actionTypes.ATTEMPT_CONNECTION:
      const attempts = state.connectionAttempts + 1;

      return Object.assign( {}, state,
        { connectionAttempts: attempts
        , reconnectTime: determineInterval( attempts )
        }
      );

    case actionTypes.RECONNECT_TICK:
      return Object.assign( {}, state,
        { reconnectTime: Math.max( 0, state.reconnectTime - 1000 )
        }
      );

    case actionTypes.WS_STATE_CHANGED:
      return Object.assign( {}, state,
        { isChanging: payload.readyState === 0 || payload.readyState === 2
        , SIDShow: payload.readyState === 0 || payload.readyState === 2
        , SIDMessage: getSIDMessage( state, payload.readyState )
        , readyState: READY_STATE[ payload.readyState ]
        , connectionAttempts: payload.readyState === 1
                            ? 0
                            : state.connectionAttempts
        }
      );

    case actionTypes.WS_TARGET_CHANGED:
      return Object.assign( {}, state,
        { ...payload }
      );

    default:
      return state;
  }

}
