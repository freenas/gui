// Events Flux Store
// =================

"use strict";

import _ from "lodash";

import FreeNASDispatcher from "../dispatcher/FreeNASDispatcher";
import { ActionTypes } from "../constants/FreeNASConstants";
import FluxBase from "./FLUX_STORE_BASE_CLASS";
import { EVENTS as EVENTS_LIMIT } from "../constants/StoreLimits";

var _events = [];
var _eventCount = 0;

class EventsStore extends FluxBase {

  constructor () {
    super();

    this.dispatchToken = FreeNASDispatcher.register(
      handlePayload.bind( this )
    );
  }

  get events () {
    return _events;
  }
}

function handlePayload( payload ) {
  const action = payload.action;

  switch ( action.type ) {
    case ActionTypes.RECEIVE_EVENTS:
      _events = _.take( action.events, EVENTS_LIMIT );
      this.emitChange( "events" );
      break;
  }
}

export default new EventsStore();
