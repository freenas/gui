// ROOT REDUCER
// ============

import { combineReducers } from "redux";

import authentication from "./auth";

const rootReducer = combineReducers(
  { authentication
  }
);

export default rootReducer;
