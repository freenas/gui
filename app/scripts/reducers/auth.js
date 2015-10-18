// AUTH REDUCER
// ============

"use strict";

import * as actionTypes from "../actions/actionTypes";

const INITIAL_STATE =
  { isFetching    : false
  , didInvalidate : false
  , loggedIn      : false
  , badCombo      : false
  , SIDShow       : true
  , SIDMessage    : "Welcome to FreeNAS X"
  , username      : ""
  , password      : ""
  , token         : null
  , tokenExpiry   : null
  , activeUser    : ""
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
        , SIDMessage : "Logging you in..."
        }
      );

    case actionTypes.LOGIN_SUCCESS:
      return Object.assign( {}, state,
        { isFetching  : false
        , SIDShow     : false
        , SIDMessage  : "Login successful"
        , loggedIn    : true
        , badCombo    : false
        , password    : ""
        , token       : payload.token
        , tokenExpiry : payload.tokenExpiry
        , activeUser  : payload.activeUser
        });

    case actionTypes.LOGIN_FAILURE:
      return Object.assign( {}, state,
        { isFetching : false
        , SIDShow    : true
        , SIDMessage : "The username or password was incorrect"
        , badCombo   : true
        });

    case actionTypes.LOGOUT:
      return Object.assign( {}, state,
        { isFetching : false
        , SIDShow    : true
        , SIDMessage : "You have logged out"
        , loggedIn   : false
        });

    default:
      return state;
  }
}
