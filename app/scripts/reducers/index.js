// ROOT REDUCER
// ============

import { combineReducers } from "redux";

import auth from "./auth";
import disks from "./disks";
import rpc from "./rpc";
import tasks from "./tasks";
import volumes from "./volumes";
import websocket from "./websocket";

const rootReducer = combineReducers(
  { auth
  , disks
  , rpc
  , tasks
  , volumes
  , websocket
  }
);

export default rootReducer;
