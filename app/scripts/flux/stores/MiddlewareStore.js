// Middleware Flux Store
// =====================
// Maintain consistent information about the general state of the middleware
// client, including which channels are connected,
// pending calls, and blocked operations.

"use strict";

import _ from "lodash";
import { EventEmitter } from "events";

import FreeNASDispatcher from "../dispatcher/FreeNASDispatcher";
import { ActionTypes } from "../constants/FreeNASConstants";
import FluxBase from "./FLUX_STORE_BASE_CLASS";

var CHANGE_EVENT = "change";

var _rpcServices    = [];
var _rpcMethods     = {};
var _events         = [];

var reconnectETA = null;
var connection =
  { protocol: null
  , host: null
  , path: null
  , status: "DISCONNECTED"
  , mode: null
  };

class MiddlewareStore extends FluxBase {

  constructor () {
    super();
    this.dispatchToken =
      FreeNASDispatcher.register( handlePayload.bind( this ) );
  }

  // RPC
  getAvailableRPCServices () {
    return _rpcServices;
  }

  getAvailableRPCMethods () {
    return _rpcMethods;
  }

  get protocol () { return connection.protocol; }
  get host ()     { return connection.host; }
  get path ()     { return connection.path; }
  get status ()   { return connection.status; }
  get mode ()     { return connection.mode; }

  get connected () {
    return ( connection.status === "CONNECTED" );
  }

  get sockState () {
    return [ this.connected, reconnectETA ];
  }

  // EVENTS
  getEventLog () {
    return _events;
  }
};

function handlePayload ( payload ) {
  let action = payload.action;

  switch ( action.type ) {

    case ActionTypes.UPDATE_SOCKET_STATE:
      connection = _.merge( connection, action.connection );
      this.emitChange( "SOCKET_STATE" );
      break;

    case ActionTypes.UPDATE_RECONNECT_TIME:
      reconnectETA = action.ETA;
      this.emitChange();
      break;

    case ActionTypes.MIDDLEWARE_EVENT:

      // Prepend latest event to the front of the array
      _events.unshift( action.eventData );
      this.emitChange( "events" );

      break;

    case ActionTypes.LOG_MIDDLEWARE_TASK_QUEUE:

      // TODO: handle task queue

      this.emitChange();
      break;

    case ActionTypes.RECEIVE_RPC_SERVICES:
      _rpcServices = action.services;

      this.emitChange( "services" );
      break;

    case ActionTypes.RECEIVE_RPC_SERVICE_METHODS:
      _rpcMethods[ action.service ] = action.methods;

      this.emitChange( "methods" );
      break;

    default:
    // No action
  }
}

export default new MiddlewareStore();
