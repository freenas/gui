// Users Action Creators
// ==================================
// Receive and handle data and events regarding updates to FreeNAS

"use strict";

import FreeNASDispatcher from "../dispatcher/FreeNASDispatcher";
import { ActionTypes } from "../constants/FreeNASConstants";

class UpdateActionCreators {
  static receiveUpdateConfig ( updateConfig, timestamp ) {
    FreeNASDispatcher.handleMiddlewareAction (
      { type: ActionTypes.RECEIVE_UPDATE_CONFIG
      , timestamp
      , updateConfig
      }
    );
  }

  static receiveCurrentTrain ( currentTrain, timestamp ) {
    FreeNASDispatcher.handleMiddlewareAction (
      { type: ActionTypes.RECEIVE_CURRENT_TRAIN
      , timestamp
      , currentTrain
      }
    );
  }

  static receiveUpdateInfo ( updateInfo, timestamp ) {
    FreeNASDispatcher.handleMiddlewareAction (
      { type: ActionTypes.RECEIVE_UPDATE_INFO
      , timestamp
      , updateInfo
      }
    );
  }

  static receiveUpdateAvailable ( updateAvailable, timestamp ) {
    FreeNASDispatcher.handleMiddlewareAction (
      { type: ActionTypes.RECEIVE_UPDATE_AVAILABLE
      , timestamp
      , updateAvailable
      }
    );
  }

  static receiveUpdateTrains ( trains, timestamp ) {
    FreeNASDispatcher.handleMiddlewareAction (
      { type: ActionTypes.RECEIVE_UPDATE_TRAINS
      , timestamp
      , trains
      }
    );
  }

  static receiveConfigureUpdateTask ( taskID, timestamp ) {
    FreeNASDispatcher.handleClientAction(
      { type: ActionTypes.RECEIVE_CONFIGURE_UPDATE_TASK
      , taskID
      , timestamp
      }
    );
  }

  static receiveUpdateNowTask ( taskID, timestamp ) {
    FreeNASDispatcher.handleClientAction(
      { type: ActionTypes.RECEIVE_UPDATE_NOW_TASK
      , taskID
      , timestamp
      }
    );
  }

  static receiveDownloadUpdateTask ( taskID, timestamp ) {
    FreeNASDispatcher.handleClientAction(
      { type: ActionTypes.RECEIVE_DOWNLOAD_UPDATE_TASK
      , taskID
      , timestamp
      }
    );
  }

  static receiveManualUpdateTask ( taskID, timestamp ) {
    FreeNASDispatcher.handleClientAction(
      { type: ActionTypes.RECEIVE_MANUAL_UPDATE_TASK
      , taskID
      , timestamp
      }
    );
  }

  static receiveVerifyInstallTask ( taskID, timestamp ) {
    FreeNASDispatcher.handleClientAction(
      { type: ActionTypes.RECEIVE_VERIFY_INSTALL_TASK
      , taskID
      , timestamp
      }
    );
  }
};

export default UpdateActionCreators;
