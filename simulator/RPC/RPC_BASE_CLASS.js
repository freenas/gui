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

  // Default implementation for use with EntitySubscriber
  emitChange ( method, newData ) {

    // EntitySubscriber needs to know the exact change event, so send it
    // as an argument as well.
    this.emit( this.CHANGE_EVENT, this.CHANGE_EVENT, method, newData );
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
