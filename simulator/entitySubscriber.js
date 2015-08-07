// Entity Subscriber Class
// ======================
// Handles all subscriptions. Each namespace handles emitting its own events

"use strict";

import _ from "lodash";

import { EventEmitter } from "events";

import volumeMiddleware from "./RPC/volumes/volumes";

class EntitySubscriber extends EventEmitter {

  constructor ( rpcClasses ) {
    super();

    this.BASE_NAMESPACE = "entity-subscriber";

    this.rpcClasses = rpcClasses;

    // Register event listeners for all active namespaces
    _.forEach( this.rpcClasses
             , function addListenersToRPCClasses ( rpcClass ) {
               try {
                 rpcClass.addChangeListener( this.sendEvent.bind( this ) );
               } catch ( err ) {
                 console.warn( err.message );
               }
             }
             , this
    );

  }

  sendEvent ( originEvent, content ) {
    // TODO: Actually check subscriptions before dispatching event

    this.emit( this.BASE_NAMESPACE
             , this.BASE_NAMESPACE + "." + originEvent
             , content );
  }

  addEventListener ( callback ) {
    this.on( this.BASE_NAMESPACE, callback );
  }

}


export default EntitySubscriber;
