// FLUX STORE BASE CLASS
// =====================
// Defines some common methods which all stores implement, and properly extends
// EventEmitter.

"use strict";

import _ from "lodash";
import DL from "../../utility/DebugLogger";

import { EventEmitter } from "events";

class FluxBaseClass extends EventEmitter {

  constructor () {
    super();

    this.CHANGE_EVENT   = "change";
    this.ITEM_SCHEMA    = null;

    this.lastFullUpdate = 0;
  }

  get isInitialized () {
    return this.lastFullUpdate > 0;
  }

  set fullUpdateAt ( timestamp ) {
    this.lastFullUpdate = timestamp;
  }

  get itemSchema () {
    if ( this.ITEM_SCHEMA ) {
      return this.ITEM_SCHEMA;
    } else {
      throw new Error( "The ITEM_SCHEMA for this Flux store was not defined:" );
      DL.dir( this );
      return false;
    }
  }

  emitChange ( changeMask ) {
    this.emit( this.CHANGE_EVENT, changeMask );
  }

  addChangeListener ( callback ) {
    this.on( this.CHANGE_EVENT, callback );
  }

  removeChangeListener ( callback ) {
    this.removeListener( this.CHANGE_EVENT, callback );
  }
};

export default FluxBaseClass;
