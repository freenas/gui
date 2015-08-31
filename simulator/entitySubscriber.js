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

  sendEvent ( originEvent, originMethod, content, timeout = 0 ) {
    // TODO: Actually check subscriptions before dispatching event
    // TODO: Emulate actual behavior. Only emit an event as entity-subscriber.*
    // if the original event ends in .changed AND the event includes ids to
    // query for the data AND the query function exists and is successful


    var operation = null;
    var service = null;
    var message = {};

    var originEventType = originEvent.split( "." ).pop();

    if ( originMethod ) {
      let methodInfo = originMethod.split( "." );
      operation = methodInfo.pop();
      service = methodInfo.length === 1
              ? methodInfo[0]
              : methodInfo[0] + "." + methodInfo[1];
    }

    // statd messages are formatted totally differently. Those messages are
    // handled in the statd RPC class.
    if ( _.startsWith( originEvent, "statd.") ) {
      message =
        { args: content
        , name: originEvent
        }
    } else {
      message =
        { args:
          { entities: [ content ]
          , operation: operation
          , service: service
          , timestamp: moment().unix()
          }
          // Only prepend "entity-subscriber" if the event is a "changed" event,
          // (which should be a change to some number of members of an
          // enumerable group) AND if there are entities to send.
        , name: originEventType === "changed" && content
              ? this.BASE_NAMESPACE + "." + originEvent
              : originEvent
        };
    }
    setTimeout( this.emit.bind( this )
              , timeout + 100
              , this.BASE_NAMESPACE
              , message
              );
  }

  addEventListener ( callback ) {
    this.on( this.BASE_NAMESPACE, callback );
  }

  removeEventListener ( callback ) {
    this.removeListener( this.BASE_NAMESPACE, callback );
  }

}


export default EntitySubscriber;
