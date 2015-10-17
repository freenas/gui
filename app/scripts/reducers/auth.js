// AUTH REDUCER
// ============

"use strict";

import * as actionTypes from "../actions/actionTypes";

const INITIAL_STATE =
  { isFetching    : false
  , didInvalidate : false
  , loggedIn      : false
  , badCombo      : false
  , message       : "Welcome to FreeNAS X"
  , username      : ""
  , password      : ""
  , token         : null
  , tokenExpiry   : null
  , activeUser    : ""
  , showSID       : true
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

    case actionTypes.LOGIN_SUBMIT:
      return Object.assign( {}, state,
        { isFetching : true
        , badCombo   : false
        , message    : "Logging you in..."
        }
      );

    case actionTypes.LOGIN_SUCCESS:
      return Object.assign( {}, state,
        { isFetching  : false
        , loggedIn    : true
        , badCombo    : false
        , password    : ""
        , message     : "Login successful"
        , showSID     : false
        , token       : payload.token
        , tokenExpiry : payload.tokenExpiry
        , activeUser  : payload.activeUser
        });

    case actionTypes.LOGIN_FAILURE:
      return Object.assign( {}, state,
        { isFetching : false
        , badCombo   : true
        , message    : "The username or password was incorrect"
        });

    default:
      return state;
  }
}
