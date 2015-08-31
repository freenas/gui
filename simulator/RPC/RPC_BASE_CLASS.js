// Base Class for RPC task handlers
// ================================
// All RPC classes will use this, but not all of them will be used as
// EventEmitters (at least at first).

"use strict";

import { EventEmitter } from "events";
import _ from "lodash";

class RPCBaseClass extends EventEmitter {
  constructor () {
    super();

    this.namespace = "";
    this.CHANGE_EVENT = null;
    this.TASK_EVENT = null;
  }

  // Default implementation for use with EntitySubscriber
  emitChange ( event, method, newData ) {
    // EntitySubscriber needs to know the exact change event, so send it
    // as an argument as well.
    this.emit( event, event, method, newData );
  }

  // Tasks need a lot more data than change events
  emitTask ( event, method, timeout, owner, args, newData, success ) {
    this.emit( event, method, timeout, owner, args, newData, success );
  }

  addChangeListener( callback ) {
    if ( this.CHANGE_EVENT ) {
      if ( _.isArray( this.CHANGE_EVENT ) ) {
        for ( let changeEvent of this.CHANGE_EVENT ){
          this.on( changeEvent, callback );
        }
      } else {
        this.on( this.CHANGE_EVENT, callback );
      }
    } else {
      // Errors here are too noisy.
    }
  }

  addTaskListener( callback ) {
    if ( this.TASK_EVENT ) {
      if ( _.isArray( this.TASK_EVENT ) ) {
        for ( let taskEvent of this.TASK_EVENT ){
          this.on( taskEvent, callback );
        }
      } else {
        this.on( this.TASK_EVENT, callback );
      }
    } else {
      // Errors here are too noisy.
    }
  }

};


export default RPCBaseClass;
