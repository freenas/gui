// System Flux Store
// ----------------

"use strict";

import _ from "lodash";

import FreeNASDispatcher from "../dispatcher/FreeNASDispatcher";
import { ActionTypes } from "../constants/FreeNASConstants";
import FluxBase from "./FLUX_STORE_BASE_CLASS";

var CHANGE_EVENT = "change";

var _systemInfoData = {};
var _systemDeviceData = {};
var _systemGeneralConfig = {};
var _localUpdatePending = [];

class SystemStore extends FluxBase {

  constructor () {
    super();

    this.dispatchToken = FreeNASDispatcher.register(
      handlePayload.bind( this )
    );

  }

  getSystemInfo ( name ) {
    return _systemInfoData[name];
  }

  getSystemDevice ( name ) {
    return _systemDeviceData[name];
  }

  get systemGeneralConfig () {
    return _systemGeneralConfig;
  }

  /**
   * Check if there are any pending update tasks.
   * @return {Boolean}
   */
  isUpdating () {
    return _localUpdatePending.length > 0;
  }

}

function handlePayload ( payload ) {
  var action = payload.action;

  switch ( action.type ) {

    case ActionTypes.RECEIVE_SYSTEM_INFO_DATA:
      _systemInfoData[action.systemInfoName] = action.systemInfo;
      this.emitChange();
      break;
    case ActionTypes.RECEIVE_SYSTEM_DEVICE_DATA:
      _systemDeviceData[action.systemDeviceArgument] = action.systemDevice;
      this.emitChange();
      break;
    case ActionTypes.RECEIVE_SYSTEM_GENERAL_CONFIG_DATA:
      _systemGeneralConfig = action.config;
      this.emitChange();
      break;
    case ActionTypes.RECEIVE_SYSTEM_GENERAL_CONFIG_UPDATE:
      _localUpdatePending.push( action.taskID );
      this.emitChange();
      break;
    case ActionTypes.MIDDLEWARE_EVENT:
      let args = action.eventData.args;
      if ( args.name === "task.updated"
          && args.args.name === "system.general.configure"
          && args.args.state === "FINISHED" ) {
        _localUpdatePending = _.without( _localUpdatePending, args.args.id );
        this.emitChange();
      }
      break;

    default:
      // No action
      break;
  }
}

export default new SystemStore();
