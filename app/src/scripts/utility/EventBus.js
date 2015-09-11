// GLOBAL EVENT BUS
// =====================
// Small event bus to assist with propagating events across the entire app, and
// between components which have no parent-child relationship.

"use strict";

import _ from "lodash";
import { EventEmitter } from "events";

class EventBus extends EventEmitter {

  constructor () {
    super();
    this.setMaxListeners( 1000 );
  }

  get registeredEvents () {
    return _.keys( this._events );
  }

}

export default new EventBus();
