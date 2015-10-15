// AUTH REDUCER
// ============

"use strict";

import * as actionTypes from "../actions/actionTypes";

const INITIAL_STATE =
  { isFetching: false
  , didInvalidate: false
  , badCombo: false
  , username: ""
  , password: ""
  };

export default function auth ( state = INITIAL_STATE, action ) {
  const { payload, error, type } = action;

  switch ( type ) {
    case actionTypes.UPDATE_USERNAME:
      return Object.assign( {}, state, { username: payload.username });

    case actionTypes.UPDATE_PASSWORD:
      return Object.assign( {}, state, { password: payload.password });

    case actionTypes.LOGIN_SUBMIT:
      return Object.assign( {}, state, { isFetching: true });

    case actionTypes.LOGIN_SUCCESS:
      return Object.assign( {}, state,
        { isFetching: false
        , password: ""
        });

    case actionTypes.LOGIN_FAILURE:
      return Object.assign( {}, state,
        { isFetching: false
        , badCombo: true
        , password: ""
        });

    default:
      return state;
  }
}
