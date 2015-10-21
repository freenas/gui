// ROOT REDUCER
// ============

import { combineReducers } from "redux";

import auth from "./auth";
import disks from "./disks";
import middleware from "./middleware";
import tasks from "./tasks";
import volumes from "./volumes";

const rootReducer = combineReducers(
  { auth
  , disks
  , middleware
  , tasks
  , volumes
  }
);

export default rootReducer;
