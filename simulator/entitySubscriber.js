// Entity Subscriber Class
// ======================
// Handles all subscriptions. Each namespace handles emitting its own events

"use strict";

import _ from "lodash";
import moment from "moment";

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

    this.setMaxListeners( 0 );

  }

  sendEvent ( originEvent, originMethod, content ) {
    // TODO: Actually check subscriptions before dispatching event


    var operation = null;
    var service = null;

    if ( originMethod ) {
      let methodInfo = originMethod.split( "." );
      operation = methodInfo.pop();
      service = methodInfo.length === 1
              ? methodInfo[0]
              : methodInfo[0] + "." + methodInfo[1];
    }

    var message =
      { args:
        { entities: [ content ]
        , operation: operation
        , service: service
        , timestamp: moment().unix()
        }
      , name: this.BASE_NAMESPACE + "." + originEvent
      };

    this.emit( this.BASE_NAMESPACE, message );
  }

  addEventListener ( callback ) {
    this.on( this.BASE_NAMESPACE, callback );
  }

  removeEventListener ( callback ) {
    this.removeListener( this.BASE_NAMESPACE, callback );
  }

}


export default EntitySubscriber;
