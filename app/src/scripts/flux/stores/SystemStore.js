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
var _systemUIConfig = {};
var _systemAdvancedConfig = {};
var _localUpdatePending = [];
var _timezones = [];
var _keymaps = [];

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

  get systemUIConfig () {
    return _systemUIConfig;
  }

  get systemAdvancedConfig () {
    return _systemAdvancedConfig;
  }

  get keymaps () {
    return _keymaps;
  }

  get timezones () {
    return _timezones;
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
      this.emitChange( "info" );
      break;
    case ActionTypes.RECEIVE_SYSTEM_DEVICE_DATA:
      _systemDeviceData[action.systemDeviceArgument] = action.systemDevice;
      this.emitChange( "device" );
      break;
    case ActionTypes.RECEIVE_SYSTEM_GENERAL_CONFIG_DATA:
      _systemGeneralConfig = action.config;
      this.emitChange( "general" );
      break;
    case ActionTypes.RECEIVE_SYSTEM_GENERAL_CONFIG_UPDATE:
      _localUpdatePending.push( action.taskID );
      this.emitChange( "general" );
      break;
    case ActionTypes.RECEIVE_SYSTEM_UI_CONFIG_DATA:
      _systemUIConfig = action.config;
      this.emitChange( "ui" );
      break;
    case ActionTypes.RECEIVE_SYSTEM_UI_CONFIG_UPDATE:
      _localUpdatePending.push( action.taskID );
      this.emitChange( "ui" );
      break;
    case ActionTypes.RECEIVE_SYSTEM_ADVANCED_CONFIG_DATA:
      _systemAdvancedConfig = action.config;
      this.emitChange( "advanced" );
      break;
    case ActionTypes.RECEIVE_SYSTEM_ADVANCED_CONFIG_UPDATE:
      _localUpdatePending.push( action.taskID );
      this.emitChange( "advanced" );
      break;
    case ActionTypes.RECEIVE_TIMEZONES:
      _timezones = action.timezones;
      this.emitChange( "timezones" );
      break;
    case ActionTypes.RECEIVE_KEYMAPS:
      _keymaps = action.keymaps;
      this.emitChange( "keymaps" );
      break;
    case ActionTypes.MIDDLEWARE_EVENT:
      let args = action.eventData.args;
        if ( args.name === "entity-subscriber.system.general.changed" ) {
          if ( args.args.operation === "configure" ) {
            _.merge( _systemGeneralConfig, args.args.entities[0] );
            this.emitChange();
          }
        }
      // Check for all the other tasks that could complete
      if ( args.name === "task.progress"
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
