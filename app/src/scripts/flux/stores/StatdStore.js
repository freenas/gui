// statdStore
// ==========

"use strict";

import _ from "lodash";
import { EventEmitter } from "events";

import FreeNASDispatcher from "../dispatcher/FreeNASDispatcher";
import { ActionTypes } from "../constants/FreeNASConstants";
import FluxBase from "./FLUX_STORE_BASE_CLASS";

class StatdStore extends FluxBase {
  constructor () {
    super();

    this._stats = {}

    this.CHANGE_EVENT = "pulse";

    this.dispatchToken = FreeNASDispatcher.register(
      handlePayload.bind( this )
    );
  }

  get stats () {
    return this._stats;
  }

  // 'type' should be strings like "cpu", "longterm", the name of a specific
  // interface, and so on which will uniquely appear in the desired stat keys.
  getStatsByType ( type ) {
    let keys = _.keys( this._stats );
    let returnStats = [];

    for ( let i = 0; i < keys.length; i++ ) {
      if ( keys[i].search( type ) !== -1 ) {
        returnStats.push( this._stats[ key[i] ] );
      }
    }
  }
}

function handlePayload ( payload ) {
  const ACTION = payload.action;
  const eventData = ACTION.eventData;

  switch ( ACTION.type ) {

    case ActionTypes.MIDDLEWARE_EVENT:
      let eventName = eventData.args[ "name" ];
      if ( _.startsWith( eventName, "statd." ) ) {
        // Only use the data if it's not initial null data
        if ( eventData.args.args && eventData.args.args[ "value" ] ) {
          // If there's already a record of that data, use it
          if ( this._stats[ eventName ] ) {
            this._stats[ eventName ].push( eventData.args.args );
          // If there's no record for this kind of data, create it
          } else {
            this._stats[ eventName ] = [ eventData.args.args ];
          }
        } else {
          break;
        }
      }
      this.emitChange( eventName );
      break;
  }
}

export default new StatdStore();
