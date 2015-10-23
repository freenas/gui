// ROOT REDUCER
// ============

import { combineReducers } from "redux";

import auth from "./auth";
import disks from "./disks";
import rpc from "./rpc";
import shells from "./shells";
import subscriptions from "./subscriptions";
import system from "./system";
import tasks from "./tasks";
import volumes from "./volumes";
import websocket from "./websocket";

const rootReducer = combineReducers(
  { auth
  , disks
  , rpc
  , shells
  , subscriptions
  , system
  , tasks
  , volumes
  , websocket
  }
);

export default rootReducer;
