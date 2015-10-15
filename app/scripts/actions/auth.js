// AUTH ACTION CREATORS
// ====================
// "auth" namespace

"use strict";

import * as actionTypes from "./actionTypes";

export function updateUsername ( username ) {
  return (
    { type: actionTypes.UPDATE_USERNAME
    , payload: { username }
    }
  );
}

export function updatePassword ( password ) {
  return (
    { type: actionTypes.UPDATE_PASSWORD
    , payload: { password }
    }
  );
}

export function loginSubmit () {
  return { type: actionTypes.LOGIN_SUBMIT }
}

export function loginSuccess ( response ) {
  return (
    { type: actionTypes.LOGIN_SUCCESS
    , payload:
      { cookieContent : response[0]
      , cookieExpiry  : response[1]
      , token         : response[2]
      }
    }
  );
}

export function loginFailure ( errorMessage ) {
  return (
    { type: actionTypes.LOGIN_FAILURE
    , error: true
    , payload: new Error( errorMessage || "Login failed" )
    }
  );
}
