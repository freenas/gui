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
