// ROOT REDUCER
// ============

import { combineReducers } from "redux";

import auth from "./auth";
import disks from "./disks";
import events from "./events";
import network from "./network";
import rpc from "./rpc";
import shares from "./shares";
import shells from "./shells";
import statd from "./statd";
import subscriptions from "./subscriptions";
import system from "./system";
import tasks from "./tasks";
import volumes from "./volumes";
import websocket from "./websocket";
import users from "./users";
import groups from "./groups";
import update from "./update";

// SERVICES
import afp from "./afp";
import ipfs from "./ipfs";
import nfs from "./nfs";
import riak from "./riak";
import riakcs from "./riakcs";
import smb from "./smb";
import ssh from "./ssh";
import stanchion from "./stanchion";

const rootReducer = combineReducers(
  { auth
  , disks
  , events
  , network
  , rpc
  , shares
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
  , afp
  , ipfs
  , nfs
  , riak
  , riakcs
  , smb
  , ssh
  , stanchion
  }
);

export default rootReducer;
