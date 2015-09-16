// Statd Flux Store
// ================

"use strict";

import FreeNASDispatcher from "../dispatcher/FreeNASDispatcher";
import { ActionTypes } from "../constants/FreeNASConstants";
import FluxBase from "./FLUX_STORE_BASE_CLASS";

var _statdData = {};
// var _dataUpdate = [];

class StatdStore extends FluxBase {

  constructor () {
    super();

    this.dispatchToken = FreeNASDispatcher.register(
      handlePayload.bind( this )
    );
  }

  getStatdData ( name ) {
    return _statdData[name];
  }

  /*get dataUpdate () {
    return _dataUpdate;
  }*/
}

function handlePayload ( payload ) {
  const ACTION = payload.action;

  switch ( ACTION.type ) {

    case ActionTypes.RECEIVE_STATD_DATA:
      if ( action.statdData.data !== undefined ) {
        _statdData[action.dataSourceName] = action.statdData.data;
      }/* else {
        _statdData[action.dataSourceName] = (
          { error: true
          , msg: action.statdData.message
          }
        );
      }*/
      this.emitChange();
      break;

    // Not ready - check structure of event in more detail, and push the data
    // to the appropriate source directly rather than requiring a new query
    /*case ActionTypes.MIDDLEWARE_EVENT:
      if ( action.eventData.args && _.startsWith(
        action.eventData.args["name"], "statd." )
      ) {
        _dataUpdate = action.eventData.args;
        this.emitChange();
      }
      break;*/

    default:
    // No action
  }
};

export default new StatdStore();
