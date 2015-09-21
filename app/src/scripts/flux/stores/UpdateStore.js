// Update Flux Store
// =================

"use strict";

import _ from "lodash";

import FreeNASDispatcher from "../dispatcher/FreeNASDispatcher";
import { ActionTypes } from "../constants/FreeNASConstants";
import FluxBase from "./FLUX_STORE_BASE_CLASS";


var _updateConfig = {};
var _currentTrain = "";
var _updateInfo = {};
var _updateAvailable = false;
var _trains = [];
var _configureUpdateTask = null;
var _updateNowTask = null;
var _checkForUpdateTask = null;
var _downloadUpdateTask = null;
var _manualUpdateTask = null;
var _verifyInstallTask = null;

class UpdateStore extends FluxBase {
  constructor () {
    super();

    this.dispatchToken = FreeNASDispatcher.register(
      handlePayload.bind( this )
    );
  }

  get updateConfig () {
    return _updateConfig;
  }

  get currentTrain () {
    return _currentTrain;
  }

  get updateInfo () {
    return _updateInfo;
  }

  get updateAvailable () {
    return _updateAvailable;
  }

  get trains () {
    return _trains;
  }
}

function handlePayload( payload ) {
  const action = payload.action;

  switch ( action.type ) {
    case ActionTypes.RECEIVE_UPDATE_CONFIG:
      _updateConfig = action.updateConfig;
      this.emitChange( "updateConfig" );
      break;

    case ActionTypes.RECEIVE_CURRENT_TRAIN:
      _currentTrain = action.currentTrain;
      this.emitChange( "currentTrain" );
      break;

    case ActionTypes.RECEIVE_UPDATE_INFO:
      _updateInfo = action.updateInfo;
      this.emitChange( "updateInfo" );
      break;

    case ActionTypes.RECEIVE_UPDATE_AVAILABLE:
      _updateAvailable = action.updateAvailable;
      this.emitChange( "updateAvailable" );
      break;

    case ActionTypes.RECEIVE_UPDATE_TRAINS:
      _trains = action.trains;
      this.emitChange( "trains" );
      break;

    case ActionTypes.RECEIVE_CONFIGURE_UPDATE_TASK:
      _configureUpdateTask = action.taskID;
      this.emitChange( "configureUpdateTask" );
      break;

    case ActionTypes.RECEIVE_UPDATE_NOW_TASK:
      _updateNowTask = action.taskID;
      this.emitChange( "updateNowTask" );
      break;

    case ActionTypes.RECEIVE_UPDATE_CHECK_TASK:
      _checkForUpdateTask = action.taskID;
      this.emitChange( "updateCheckTask" );
      break;

    case ActionTypes.RECEIVE_DOWNLOAD_UPDATE_TASK:
      _downloadUpdateTask = action.taskID;
      this.emitChange( "downloadUpdateTask" );
      break;

    case ActionTypes.RECEIVE_MANUAL_UPDATE_TASK:
      _manualUpdateTask = action.taskID;
      this.emitChange( "manualUpdateTask" );
      break;

    case ActionTypes.RECEIVE_VERIFY_INSTALL_TASK:
      _verifyInstallTask = action.taskID;
      this.emitChange( "verifyInstallTask" );
      break;

    // Handle task events and any event that may not have originated with this
    // session:
    case ActionTypes.MIDDLEWARE_EVENT:
      handleMiddlewareEvent.call( this, payload );
    break;
  }
}

function handleMiddlewareEvent ( payload ) {
  const action = payload.action;
  const args = action.eventData.args;
  switch ( args.name ) {
    case "update.changed":
    // React to change in update config that may not have originated with
    // this session
      break;

    case "update.in_progress":
    // React to an update that may not have originated with this session.
      break;

    case "task.progress":
      // switch in a switch. It can't be helped. There are five distinct tasks
      // we care about, and each needs slightly different handling.
      switch ( args.args.name ) {
        case "update.update":
          break;

        case "update.check":
          if ( args.args.state === "FINISHED" ) {
            this.emitChange( "updateCheckFinished" );
          }
          break;

        case "update.download":
          break;

        case "update.manual":
          break;

        case "update.verify":
          break;

        case "update.configure":
          break;
      }
    break;
  }
}

export default new UpdateStore();
