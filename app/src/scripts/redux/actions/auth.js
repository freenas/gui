// AUTH ACTION CREATORS
// ====================
// "auth" namespace

"use strict";

import { LOGIN_SUBMIT, LOGIN_SUCCESS, LOGIN_FAILURE } from "../actionTypes";

export function loginSubmit () {
  return { type: LOGIN_SUBMIT }
}

export function loginSuccess ( response ) {
  return (
    { type: LOGIN_SUCCESS
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
    { type: LOGIN_FAILURE
    , error: true
    , payload: new Error( errorMessage || "Login failed" )
    }
  );
}
