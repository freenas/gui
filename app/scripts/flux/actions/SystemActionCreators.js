// System.Info Action Creators
// ==================================

"use strict";

import FreeNASDispatcher from "../dispatcher/FreeNASDispatcher";
import { ActionTypes } from "../constants/FreeNASConstants";

class SystemActionCreators {

  static receiveSystemInfo ( systemInfoName, systemInfo, timestamp ) {
    FreeNASDispatcher.handleMiddlewareAction(
      { type: ActionTypes.RECEIVE_SYSTEM_INFO_DATA
      , timestamp
      , systemInfo
      , systemInfoName
      }
    );
  }

  static receiveSystemDevice ( systemDeviceArgument, systemDevice, timestamp ) {
    FreeNASDispatcher.handleMiddlewareAction(
      { type: ActionTypes.RECEIVE_SYSTEM_DEVICE_DATA
      , timestamp
      , systemDevice
      , systemDeviceArgument
      }
    );
  }

  static receiveSystemGeneralConfig ( config, timestamp ) {
    FreeNASDispatcher.handleMiddlewareAction(
      { type: ActionTypes.RECEIVE_SYSTEM_GENERAL_CONFIG_DATA
      , timestamp
      , config }
    );
  }

  static receiveSystemGeneralConfigUpdateTask ( taskID, timestamp ) {
    FreeNASDispatcher.handleMiddlewareAction(
      { type: ActionTypes.RECEIVE_SYSTEM_GENERAL_CONFIG_UPDATE
      , timestamp
      , taskID
      }
    );
  }

  static receiveSystemUIConfig ( config, timestamp ) {
    FreeNASDispatcher.handleMiddlewareAction(
      { type: ActionTypes.RECEIVE_SYSTEM_UI_CONFIG_DATA
      , timestamp
      , config }
    );
  }

  static receiveSystemUIConfigUpdateTask ( taskID, timestamp ) {
    FreeNASDispatcher.handleMiddlewareAction(
      { type: ActionTypes.RECEIVE_SYSTEM_UI_CONFIG_UPDATE
      , timestamp
      , taskID
      }
    );
  }

  static receiveSystemAdvancedConfig ( config, timestamp ) {
    FreeNASDispatcher.handleMiddlewareAction(
      { type: ActionTypes.RECEIVE_SYSTEM_ADVANCED_CONFIG_DATA
      , timestamp
      , config
      }
    );
  }

  static receiveSystemAdvancedConfigUpdateTask ( taskID, timestamp ) {
    FreeNASDispatcher.handleMiddlewareAction(
      { type: ActionTypes.RECEIVE_SYSTEM_ADVANCED_CONFIG_UPDATE
      , timestamp
      , taskID
      }
    );
  }

  static receiveTimezones ( timezones, timestamp ) {
    FreeNASDispatcher.handleMiddlewareAction(
      { type: ActionTypes.RECEIVE_TIMEZONES
      , timestamp
      , timezones
      }
    );
  }

  static receiveKeymaps ( keymaps, timestamp ) {
    FreeNASDispatcher.handleMiddlewareAction(
      { type: ActionTypes.RECEIVE_KEYMAPS
      , timestamp
      , keymaps
      }
    );
  }

  static receiveVersion ( version, timestamp ) {
    FreeNASDispatcher.handleMiddlewareAction(
      { type: ActionTypes.RECEIVE_VERSION
      , timestamp
      , version
      }
    );
  }
};

export default SystemActionCreators;
