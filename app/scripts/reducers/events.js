// EVENTS - REDUCER
// ================

"use strict";

import * as TYPES from "../actions/actionTypes";

const INITIAL_STATE =
  { events: "TODO: Store events :)"
  };


export default function disks ( state = INITIAL_STATE, action ) {
  const { payload, error, type } = action;

  switch( type ) {
    default:
      return state;
  }
}
