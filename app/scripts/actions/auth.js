// AUTH ACTION CREATORS
// ====================
// "auth" namespace

"use strict";

import * as actionTypes from "./actionTypes";
import MiddlewareClient from "../websocket/MiddlewareClient";

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


// LOGIN ACTIONS
function loginSubmit () {
  return { type: actionTypes.LOGIN_SUBMIT }
}

function loginSuccess ( response ) {
  return (
    { type: actionTypes.LOGIN_SUCCESS
    , payload:
      { token       : response[0]
      , tokenExpiry : response[1]
      , activeUser  : response[2]
      }
    }
  );
}

function loginFailure ( errorMessage ) {
  return (
    { type: actionTypes.LOGIN_FAILURE
    , error: true
    , payload: new Error( errorMessage || "Login failed" )
    }
  );
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

function handleSuccess ( response ) {
  return ( dispatch, getState ) => {

    // On a successful login, dequeue any actions which may have been requested
    // either before the connection was made, or before the authentication was
    // complete.
    MiddlewareClient.changeAuth( true );
    MiddlewareClient.dequeueActions();

    return dispatch( loginSuccess( response ) );
  }
}

function handleFailure ( response ) {
  return ( dispatch, getState ) => {
    MiddlewareClient.changeAuth( false );

    return dispatch( loginFailure( response ) );
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
                            , ( response ) => dispatch( handleSuccess( response ) )
                            , ( response ) => dispatch( handleFailure( response ) )
                            );

      return dispatch( loginSubmit() );
    }
  }
}
