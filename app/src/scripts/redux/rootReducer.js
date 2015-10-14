// ROOT REDUCER
// ============

"use strict";

import { combineReducers } from "redux";

import authentication from "./reducers/auth";

const rootReducer = combineReducers(
  { authentication
  }
);

export default rootReducer;
