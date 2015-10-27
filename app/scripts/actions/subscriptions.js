// SUBSCRIPTIONS - ACTIONS
// =======================
// Generic interface for subscribing to Middleware namespaces. The Middleware
// reducer records the number of React components which have required a
// subscription to a Middleware namespace. This allows the Middleware Client
// to make intelligent decisions about whether to query a namespace for fresh
// data, begin or end a subscription, or even garbage collect a data which is no
// longer being used.


import * as TYPES from "../actions/actionTypes";
import MC from "../websocket/MiddlewareClient";


// SUBSCRIBE
function subscribe ( masks, componentID ) {
  return { type: TYPES.SUBSCRIBE
         , payload: { masks, componentID }
         }
}

export function add ( masks, componentID ) {
  return ( dispatch, getState ) => {

    if ( !Array.isArray( masks ) ) {
      console.error( "The first argument in subscribe() must be an array of "
                   + "FreeNAS RPC namespaces."
                   , masks
                   );
      return;
    }

    if ( typeof componentID !== "string" ) {
      console.error( "The second argument in subscribe() must be a string "
                   + "(usually the displayName of the React component calling "
                   + "it)."
                   , componentID
                   );
      return;
    }

    const { subscriptions } = getState();
    let newSubs = [];

    masks.forEach( mask => {
      // Short-circuit for empty masks
      if ( mask.length === 0 ) return;

      // Short-circuit for existing keys (mask already subscribed)
      if ( subscriptions.active.hasOwnProperty( mask ) ) return;

      // Any mask which is not found in active subscriptions will be sent to the
      // FreeNAS middleware.
      newSubs.push( mask );
    });

    // In the event that there are new subscriptions, send them
    if ( newSubs.length ) {
      MC.subscribe( newSubs
                  , () => dispatch( subscribe( masks, componentID ) )
                  );
    }
  }
}


// UNSUBSCRIBE
function unsubscribe ( masks, componentID ) {
  return { type: TYPES.UNSUBSCRIBE
         , payload: { masks, componentID }
         }
}

export function remove ( masks, componentID ) {
  return ( dispatch, getState ) => {

    if ( !Array.isArray( masks ) ) {
      console.error( "The first argument in unsubscribe() must be an array of "
                   + "FreeNAS RPC namespaces."
                   , masks
                   );
      return;
    }

    if ( typeof componentID !== "string" ) {
      console.error( "The second argument in unsubscribe() must be a string "
                   + "(usually the displayName of the React component calling "
                   + "it)."
                   , componentID
                   );
      return;
    }

    const { subscriptions } = getState();

    let unSubs = [];

    masks.forEach( mask => {
      // Short-circuit for empty masks
      if ( mask.length === 0 ) return;

      // Only run if there is some active subscription using this mask
      if ( subscriptions.active.hasOwnProperty( mask ) ) {
        let activeCount = 0;

        // For each componentID in mask, increment activeCount to determine
        // the total number of active subscriptions for a mask
        Object.keys( subscriptions.active[ mask ] ).forEach( id => {
          activeCount += subscriptions.active[ mask ][ id ];
        });

        // If there is only one active subscription left, we're going to send
        // the unsubscribe action.
        if ( activeCount === 1 ) unSubs.push( mask );
      }
    });

    // In the event that there are any masks from which we will unsubscribe,
    // send the request
    if ( unSubs.length ) {
      MC.unsubscribe( unSubs
                    , () => dispatch( unsubscribe( masks, componentID ) )
                    );
    }
  }
}

export function entityChanged ( mask, data ) {
  return { type: TYPES.ENTITY_CHANGED
         , payload: { mask, data }
         };
}
