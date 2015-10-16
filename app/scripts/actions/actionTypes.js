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

// middleware
export const WS_TARGET_CHANGED = "WS_TARGET_CHANGED";
export const WS_STATE_CHANGED = "WS_STATE_CHANGED";
