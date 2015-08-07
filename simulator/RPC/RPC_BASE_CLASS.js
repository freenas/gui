// Base Class for RPC task handlers
// ================================
// All RPC classes will use this, but not all of them will be used as
// EventEmitters (at least at first).

"use strict";

import { EventEmitter } from "events";

class RPCBaseClass extends EventEmitter {
  constructor () {
    super();

    this.namespace = "";
    this.CHANGE_EVENT = null;
  }

  emitChange ( newData ) {

    // Yes, include the CHANGE_EVENT twice. This is so that the entitySubscriber
    // will have access to to the name of the event it received, so that it can
    // in turn make it available to the top level simulator.
    this.emit( this.CHANGE_EVENT, this.CHANGE_EVENT, newData );
  }

  addChangeListener( callback ) {
    if ( this.CHANGE_EVENT ) {
      this.on( this.CHANGE_EVENT, callback );
    } else {
      // Errors here are too noisy.
    }
  }

};


export default RPCBaseClass;
