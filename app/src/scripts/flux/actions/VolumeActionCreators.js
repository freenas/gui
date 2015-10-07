// Zfs.Pool Action Creators
// ==================================

"use strict";

import FreeNASDispatcher from "../dispatcher/FreeNASDispatcher";
import { ActionTypes } from "../constants/FreeNASConstants";

export default class VolumeActionCreators {

  // SERVER METHODS
  static receiveVolumes ( volumes, timestamp ) {
    FreeNASDispatcher.handleMiddlewareAction(
      { type: ActionTypes.RECEIVE_VOLUMES
      , timestamp
      , volumes
      }
    );
  }

  static receiveAvailableDisks ( disks, timestamp ) {
    FreeNASDispatcher.handleMiddlewareAction(
      { type: ActionTypes.RECEIVE_AVAILABLE_DISKS
      , timestamp
      , disks
      }
    );
  }

  static receiveVolumeCreateTask ( taskID, timestamp ) {
    FreeNASDispatcher.handleClientAction(
      { type: ActionTypes.RECEIVE_VOLUME_CREATE_TASK
      , taskID
      , timestamp
      }
    );
  }

  static receiveVolumeUpdateTask ( taskID, timestamp ) {
    FreeNASDispatcher.handleClientAction(
      { type: ActionTypes.RECEIVE_VOLUME_UPDATE_TASK
      , taskID
      , timestamp
      }
    );
  }

  static receiveVolumeDestroyTask ( taskID, timestamp ) {
    FreeNASDispatcher.handleClientAction(
      { type: ActionTypes.RECEIVE_VOLUME_DESTROY_TASK
      , taskID
      , timestamp
      }
    );
  }

  // CLIENT METHODS
  static replaceDiskSelection ( disks ) {
    FreeNASDispatcher.handleClientAction(
      { type: ActionTypes.DISKS_SELECTION_REPLACE
      , disks
      }
    );
  }
  static selectDisks ( disks ) {
    FreeNASDispatcher.handleClientAction(
      { type: ActionTypes.DISKS_SELECTED
      , disks
      }
    );
  }

  static deselectDisks ( disks ) {
    FreeNASDispatcher.handleClientAction(
      { type: ActionTypes.DISKS_DESELECTED
      , disks
      }
    );
  }

}
