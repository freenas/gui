// AUTH REDUCER
// ============

"use strict";

import { LOGIN_SUBMIT, LOGIN_SUCCESS, LOGIN_FAILURE } from "../actionTypes";

const INITIAL_STATE =
  { isFetching: false
  , didInvalidate: false
  , username: ""
  , password: ""
  };

export default function authentication ( state = INITIAL_STATE, action ) {
  const { payload, error, type } = action;

  switch ( type ) {
    case LOGIN_SUBMIT:
      return Object.assign( {}, state, { isFetching: true });

    case LOGIN_SUCCESS:
      return Object.assign( {}, state,
        { isFetching: false
        , password: ""
        });

    case LOGIN_FAILURE:
      return Object.assign( {}, state,
        { isFetching: false
        , password: ""
        });

    default:
      return state;
  }
}
