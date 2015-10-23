// ROOT REDUCER
// ============

import { combineReducers } from "redux";

import auth from "./auth";
import disks from "./disks";
import rpc from "./rpc";
import shells from "./shells";
import tasks from "./tasks";
import volumes from "./volumes";
import websocket from "./websocket";
import system from "./system";

const rootReducer = combineReducers(
  { auth
  , disks
  , rpc
  , shells
  , tasks
  , volumes
  , websocket
  , system
  }
);

export default rootReducer;
