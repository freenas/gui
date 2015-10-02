// Statd Flux Store
// ================

"use strict";

import FreeNASDispatcher from "../dispatcher/FreeNASDispatcher";
import { ActionTypes } from "../constants/FreeNASConstants";
import { STATS as STATS_LIMIT } from "../constants/StoreLimits";
import FluxBase from "./FLUX_STORE_BASE_CLASS";

var _statdData = {};

class StatdStore extends FluxBase {

  constructor () {
    super();

    this.dispatchToken = FreeNASDispatcher.register(
      handlePayload.bind( this )
    );
  }

  getStatdData ( name ) {
    return _statdData[ name ];
  }

  /*get dataUpdate () {
    return _dataUpdate;
  }*/
}

function handlePayload ( payload ) {
  const ACTION = payload.action;

  switch ( ACTION.type ) {

    case ActionTypes.RECEIVE_STATD_DATA:
      if ( ACTION.statdData.data !== undefined ) {
        _statdData[ ACTION.dataSourceName ] = ACTION.statdData.data.slice( -STATS_LIMIT )
      }/* else {
        _statdData[ACTION.dataSourceName] = (
          { error: true
          , msg: ACTION.statdData.message
          }
        );
      }*/
      this.emitChange( ACTION.dataSourceName + " received");
      break;

    case ActionTypes.MIDDLEWARE_EVENT:
    let args = ACTION.eventData.args
      if ( args && _.startsWith(
        args["name"], "statd." )
      ) {
        // cut off the "statd." and ".pulse"
        let dataSourceName = args["name"].substring( 6, args["name"].length - 6 );
        _statdData[ dataSourceName ].push( [ args.args.timestamp, args.args.value ] );
        this.emitChange( dataSourceName + " updated" );
      }
      break;

    default:
    // No action
  }
};

export default new StatdStore();
