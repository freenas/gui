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

    this.emit( this.CHANGE_EVENT, newData );
  }

  addChangeListener( callback ) {
    if ( this.CHANGE_EVENT ) {
      this.on( this.CHANGE_EVENT, callback );
    } else {
      throw new Error( "Namespace \""
                     + this.namespace
                     + "\" does not emit any events at this time."
                     );
    }
  }

  removeChangeListener( callback ) {
    this.removeListener( this.CHANGE_EVENT, callback );
  }

};


export default RPCBaseClass;
