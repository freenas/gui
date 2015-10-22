// AUTH ACTION CREATORS
// ====================
// "auth" namespace

"use strict";

import * as TYPES from "./actionTypes";
import MiddlewareClient from "../websocket/MiddlewareClient";

export function updateUsername ( username ) {
  return (
    { type: TYPES.UPDATE_USERNAME
    , payload: { username }
    }
  );
}

export function updatePassword ( password ) {
  return (
    { type: TYPES.UPDATE_PASSWORD
    , payload: { password }
    }
  );
}


// LOGIN ACTIONS
function loginSubmit ( UUID ) {
  return { type: TYPES.LOGIN_SUBMIT_REQUEST
         , payload: { UUID }
         }
}

function allowAuthRPC ( auth ) {
  if ( auth.loggedIn || auth.isFetching ) {
    return false;
  } else if ( auth.username.length ) {
    return true;
  } else {
    return false;
  }
}

export function authRPC () {
  return ( dispatch, getState ) => {
    const state = getState();

    if ( allowAuthRPC( state.auth ) ) {
      let payload = {};
      let namespace;

      if ( state.auth.token ) {
        namespace = "auth_token";
        payload.token = state.auth.token;
      } else {
        namespace = "auth";
        payload.username = state.auth.username;
        payload.password = state.auth.password;
      }

      MiddlewareClient.login( namespace
                            , payload
                            , ( UUID ) => dispatch( loginSubmit( UUID ) )
                            );
    }
  }
}

// LOGOUT
export function logout () {
  return { type: TYPES.LOGOUT };
}
