// ACTION TYPES
// ============
// Constant string identifiers used by action creators and reducers in Redux.

"use strict";


// RPC ACTIONS
// auth
export const UPDATE_USERNAME = "UPDATE_USERNAME";
export const UPDATE_PASSWORD = "UPDATE_PASSWORD";
export const LOGIN_SUBMIT = "LOGIN_SUBMIT";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILURE = "LOGIN_FAILURE";
export const LOGOUT = "LOGOUT";
export const LOGOUT_FORCE = "LOGOUT_FORCE";

// middleware
export const WS_TARGET_CHANGED = "WS_TARGET_CHANGED";
export const WS_CONNECTING = "WS_CONNECTING";
export const WS_OPEN = "WS_OPEN";
export const WS_CLOSING = "WS_CLOSING";
export const WS_CLOSED = "WS_CLOSED";
export const ATTEMPT_CONNECTION = "ATTEMPT_CONNECTION";
export const RECONNECT_TICK = "RECONNECT_TICK";
