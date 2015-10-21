// ROOT REDUCER
// ============

import { combineReducers } from "redux";

import auth from "./auth";
import disks from "./disks";
import websocket from "./websocket";
import tasks from "./tasks";
import volumes from "./volumes";

const rootReducer = combineReducers(
  { auth
  , disks
  , websocket
  , tasks
  , volumes
  }
);

export default rootReducer;
