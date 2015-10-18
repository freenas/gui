// ROOT REDUCER
// ============

import { combineReducers } from "redux";

import auth from "./auth";
import middleware from "./middleware";

const rootReducer = combineReducers(
  { auth
  , middleware
  }
);

export default rootReducer;
