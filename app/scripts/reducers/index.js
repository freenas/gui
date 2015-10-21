// ROOT REDUCER
// ============

import { combineReducers } from "redux";

import auth from "./auth";
import disks from "./disks";
import middleware from "./middleware";
import tasks from "./tasks";

const rootReducer = combineReducers(
  { auth
  , disks
  , middleware
  , tasks
  }
);

export default rootReducer;
