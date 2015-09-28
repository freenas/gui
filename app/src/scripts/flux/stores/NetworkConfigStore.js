// Network Config Flux Store
// =========================

"use strict";

import _ from "lodash";

import FreeNASDispatcher from "../dispatcher/FreeNASDispatcher";
import { ActionTypes } from "../constants/FreeNASConstants";
import FluxBase from "./FLUX_STORE_BASE_CLASS";

const CHANGE_EVENT = "change";
const UPDATE_MASK = "network.config.changed";

var _localUpdatePending = [];
var _networkConfig = {};

class NetworkConfigStore extends FluxBase {

  constructor () {
    super();

    this.dispatchToken = FreeNASDispatcher.register(
      handlePayload.bind( this )
    );
  }

  get updateMask () {
      return UPDATE_MASK;
    }

  isUpdating () {
    return _localUpdatePending.length > 0;
  }

  get networkConfig () {
    return _networkConfig;
  }
}

function handlePayload ( payload ) {
  var action = payload.action;

  switch ( action.type ) {
    case ActionTypes.RECEIVE_NETWORK_CONFIG:
      _networkConfig = action.networkConfig;
      this.emitChange();
      break;

    case ActionTypes.MIDDLEWARE_EVENT:
      let args = action.eventData.args;
      if ( args.name === "network.changed" ) {
        if ( args.args.operation === "update" ) {
        }
      }

      /*if ( args.name === "task.updated"
          && args.args.name === "network.update"
          && args.args.state === "FINISHED" ) {
        _localUpdatePending = _.without( _localUpdatePending, args.args.id );
        this.emitChange();
      }*/
      break;

    case ActionTypes.RECEIVE_NETWORK_CONFIG_UPDATE:
      _localUpdatePending.push( action.taskID );
      this.emitChange();
      break;
  }
}

export default new NetworkConfigStore();
