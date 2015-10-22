// AUTH REDUCER
// ============

"use strict";

import * as actionTypes from "../actions/actionTypes";

const INITIAL_STATE =
  { isWaiting: false
  , loginUUID: null
  , loggedIn: false
  , badCombo: false
  , SIDShow: true
  , SIDMessage: "Welcome to FreeNAS X"
  , username: ""
  , password: ""
  , token: null
  , tokenExpiry: null
  , activeUser: ""
  };

export default function auth ( state = INITIAL_STATE, action ) {
  const { payload, error, type } = action;

  switch ( type ) {
    case actionTypes.UPDATE_USERNAME:
      return Object.assign( {}, state,
        { username: payload.username
        , badCombo: false
        }
      );

    case actionTypes.UPDATE_PASSWORD:
      return Object.assign( {}, state,
        { password: payload.password
        , badCombo: false
        }
      );

    case actionTypes.LOGIN_SUBMIT_REQUEST:
      return Object.assign( {}, state,
        { isWaiting: true
        , loginUUID: payload.UUID
        , badCombo: false
        , SIDMessage: "Logging you in..."
        }
      );


    // LOGIN REQUEST SUCCESS
    case actionTypes.RPC_SUCCESS:
      if ( state.loginUUID === payload.UUID ) {
        return Object.assign( {}, state,
          { isWaiting: false
          , loginUUID: null
          , SIDShow: false
          , SIDMessage: "Login successful"
          , loggedIn: true
          , badCombo: false
          , password: ""
          , token: payload.data[0]
          , tokenExpiry: payload.data[1]
          , activeUser: payload.data[2]
          });
      } else {
        return state;
      }

    // LOGIN FAILED (BAD COMBO)
    case actionTypes.RPC_FAILURE:
      if ( state.loginUUID === payload.UUID ) {
        return Object.assign( {}, state,
          { isWaiting: false
          , loginUUID: null
          , SIDShow: true
          , SIDMessage: "The username or password was incorrect"
          , badCombo: true
          });
      } else {
        return state;
      }

    // LOGIN FAILED (BAD COMBO)
    case actionTypes.RPC_TIMEOUT:
      if ( state.loginUUID === payload.UUID ) {
        return Object.assign( {}, state,
          { isWaiting: false
          , loginUUID: null
          , SIDShow: true
          , SIDMessage: "The login request timed out"
          , badCombo: false
          });
      } else {
        return state;
      }

    case actionTypes.LOGOUT:
      return Object.assign( {}, state,
        { isWaiting : false
        , SIDShow    : true
        , SIDMessage : "You have logged out"
        , loggedIn   : false
        });

    default:
      return state;
  }
}
