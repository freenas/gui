// ROOT REDUCER
// ============

import { combineReducers } from "redux";

import auth from "./auth";
import middleware from "./middleware";
import tasks from "./tasks";

const rootReducer = combineReducers(
  { auth
  , middleware
  , tasks
  }
);

export default rootReducer;
