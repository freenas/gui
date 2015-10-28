// ROOT REDUCER
// ============

import { combineReducers } from "redux";

import auth from "./auth";
import disks from "./disks";
import events from "./events";
import network from "./network";
import rpc from "./rpc";
import shells from "./shells";
import statd from "./statd";
import subscriptions from "./subscriptions";
import system from "./system";
import tasks from "./tasks";
import volumes from "./volumes";
import websocket from "./websocket";
import ssh from "./ssh";
import users from "./users";
import groups from "./groups";
import update from "./update";

const rootReducer = combineReducers(
  { auth
  , disks
  , events
  , network
  , rpc
  , shells
  , statd
  , subscriptions
  , system
  , tasks
  , volumes
  , websocket
  , users
  , groups
  , update

  // SERVICES
  , ssh
  }
);

export default rootReducer;
