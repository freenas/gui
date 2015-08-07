// VOLUMES STORE
// =============

"use strict";


import _ from "lodash";
import { EventEmitter } from "events";

import FreeNASDispatcher from "../dispatcher/FreeNASDispatcher";
import { ActionTypes } from "../constants/FreeNASConstants";
import DL from "../../utility/DebugLogger";
import FluxBase from "./FLUX_STORE_BASE_CLASS";

var _volumes        = {};
var _availableDisks = new Set();

class VolumeStore extends FluxBase {

  constructor () {
    super();

    this.dispatchToken = FreeNASDispatcher.register(
      handlePayload.bind( this )
    );
  }

  get availableDisks() {
    return _.sortBy( Array.from( _availableDisks ) );
  }

  listVolumes ( sortKey ) {
    if ( sortKey ) {
      return _.chain( _volumes )
              .values()
              .sortBy( sortKey )
              .value();
    } else {
      return _.values( _volumes );
    }
  }

}

// Handler for payloads from Flux Dispatcher
function handlePayload ( payload ) {
  const ACTION = payload.action;
  const eventData = ACTION.eventData;

  switch ( ACTION.type ) {

    case ActionTypes.RECEIVE_VOLUMES:
      _volumes = ACTION.volumes;
      this.fullUpdateAt = ACTION.timestamp;
      this.emitChange( "volumes" );
      break;

    case ActionTypes.RECEIVE_AVAILABLE_DISKS:
      _availableDisks = new Set( ACTION.disks );
      this.emitChange( "availableDisks" );
      break;

    case ActionTypes.MIDDLEWARE_EVENT:
      let args = eventData.args;
      if ( args.name === "entity-subscriber.volumes.changed" ) {
        if ( args.args.operation === "create" ) {
          _volumes[ args.args.entities[0][ "name" ] ] = _.cloneDeep( args.args.entities[0] );
          this.emitChange( "volumes" );
        }
      }
      break;
  }
}

export default new VolumeStore();
