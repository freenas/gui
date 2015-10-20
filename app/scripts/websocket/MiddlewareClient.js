// Webapp Middleware
// =================
// Handles the lifecycle for the websocket connection to the middleware. This is
// a utility class designed to curate general system data, including user login,
// task and event queues, disconnects, and similar events. Calling action
// creators or passing data to specific "channel" stores is out of scope for
// this class.

"use strict";

import _ from "lodash";

import freeNASUtil from "../utility/freeNASUtil";
import MCD from "./MiddlewareClientDebug";

import SubscriptionsStore from "../flux/stores/SubscriptionsStore";
import SubscriptionsActionCreators from "../flux/actions/SubscriptionsActionCreators";

import MiddlewareActionCreators from "../flux/actions/MiddlewareActionCreators";

import SAC from "../flux/actions/SessionActionCreators";

import sessionCookies from "../utility/cookies";


const defaultTimeoutDelay = 10000;

function notBoundWarn ( name ) {
  MCD.warn( `MiddlewareClient.${ name } was not bound.` );
}

class MiddlewareClient {

  constructor () {
    this.socket = null;
    this.queuedLogin = null;
    this.queuedActions = [];
    this.pendingRequests = {};
    this.isAuthenticated = false;

    // WEBSOCKET HANDLERS
    this.onSockStateChange = () => notBoundWarn( "onSockStateChange" );
    this.onLogout          = () => notBoundWarn( "onLogout" );

    // TASK SUBMISSION HANDLERS
    this.onTaskSubmitRequest = () => notBoundWarn( "onTaskSubmitRequest" );
    this.onTaskSubmitFailure = () => notBoundWarn( "onTaskSubmitFailure" );
    this.onTaskSubmitSuccess = () => notBoundWarn( "onTaskSubmitSuccess" );

    // TASK UPDATE HANDLERS
    this.onTaskCreated  = () => notBoundWarn( "onTaskCreated" );
    this.onTaskUpdated  = () => notBoundWarn( "onTaskUpdated" );
    this.onTaskProgress = () => notBoundWarn( "onTaskProgress" );
  }

  // HACK: Workaround to avoid disrupting current logic flow, but this should
  // probably come from the store instead of being hammered in by the action
  changeAuth ( bool ) {
    this.isAuthenticated = bool;
  }

  bindHandlers ( handlers ) {
    Object.assign( this, { ...handlers } );
  }

  connect ( protocol = "ws://", host = "", path = "", mode = "" ) {
    if ( "WebSocket" in window ) {
      let target = protocol + host + path;

      if ( MCD.reports( "connection" ) ) {
        MCD.info( "Creating WebSocket connection to " + target );
      }

      this.socket = new WebSocket( target );

      if ( this.socket instanceof WebSocket) {
        Object.assign( this.socket
          , { onopen: this.handleOpen.bind( this )
            , onmessage: this.handleMessage.bind( this )
            , onerror: this.handleError.bind( this )
            , onclose: this.handleClose.bind( this )
            }
          , this
          );
      } else {
        throw new Error( "Was unable to create a WebSocket instance" );
      }
    } else {
      // TODO: Visual error for legacy browsers with links to download others
      MCD.error( "This environment doesn't support WebSockets." );
    }

    this.onSockStateChange( this.socket.readyState );
  }

  // Shortcut method for closing the WebSocket connection.
  disconnect () {
    this.socket.close();
  };


  // WEBSOCKET DATA HANDLERS
  // Instance methods for handling data from the WebSocket connection. These are
  // inherited from the WebSocketClient base class, which implements core
  // functionality.

  // Triggered by the WebSocket's onopen event.
  handleOpen () {
    // Re-subscribe to any namespaces that may have been active during the
    // session. On the first login, this will do nothing.
    this.renewSubscriptions();

    if ( this.queuedLogin ) {
      // If the connection opens and we aren't authenticated, but we have a
      // queued login, dispatch the login and reset its variable.
      this.logPendingRequest( this.queuedLogin.id
                            , this.queuedLogin.successCallback
                            , this.queuedLogin.errorCallback
                            , null
                            );
      this.socket.send( this.queuedLogin.action );
      this.queuedLogin = null;

      if ( MCD.reports( "queues" ) ) {
        MCD.info( `Resolving queued login %c${ this.queuedLogin.id }`
                , [ "uuid" ]
                );
        MCD.dir( this.queuedLogin.action );
      }
    }

    // Dispatch message stating that we have just connected
    this.onSockStateChange( this.socket.readyState );
  }

  // Triggered by the WebSocket's `onclose` event. Performs any cleanup
  // necessary to allow for a clean session end and prepares for a new session.
  handleClose ( closeEvent ) {
    this.queuedLogin = null;
    this.queuedActions = [];

    if ( MCD.reports( "connection" ) ) {
      MCD.info( "WebSocket connection closed" );
    }
    this.onSockStateChange( this.socket.readyState, closeEvent );
  }

  // Triggered by the WebSocket's `onmessage` event. Parses the JSON from the
  // middleware's response, and then performs followup tasks depending on the
  // message's namespace.
  handleMessage ( message ) {

    let data;
    // TODO: The timestamp should come from the server, so we can use it for
    // reconciliation and patches.
    let timestamp = message.timeStamp;

    try {
      data = JSON.parse( message.data );
    } catch ( error ) {
      MCD.error( [ "Could not parse JSON from message:", message ] );
      return false;
    }

    if ( MCD.reports( "messages" ) ) {
      MCD.info( [ "Message from Middleware:", data.namespace, message ] );
    }

    switch ( data.namespace ) {

      // A FreeNAS event has occurred
      case "events":
        const eventName = data.name.split( "." );

        switch ( eventName[0] ) {
          case "task":
            handleTaskResponse( eventName[1], data.args.args );
            break;

          case "logout":
            sessionCookies.delete( "auth" );
            SAC.forceLogout( data.args, timestamp );
            break;

          default:
            if ( MCD.reports( "messages" ) ) {
              MCD.log( "Message contained event data" );
            }
            MiddlewareActionCreators.receiveEventData( data, timestamp );
            break;
        }
        break;

      // An RPC call is returning a response
      case "rpc":
        switch ( data.name ) {
          case "response":
            this.resolvePendingRequest( data.id
                                      , data.args
                                      , timestamp
                                      , "success"
                                      );
            break;

          case "error":
            this.resolvePendingRequest( data.id
                                      , data.args
                                      , timestamp
                                      , "error"
                                      );
            break;

          default:
            MCD.warn( "Was sent an rpc message from middleware, the client " +
                      "was unable to identify its purpose:" );
            MCD.log( message );
            break;
        }
        break;

      // There was an error with a request or with its execution on FreeNAS
      case "error":
        MCD.warn( [ "Middleware has indicated an error:", data.args ] );
        break;

      // A reply was sent from the middleware with no recognizable namespace
      // This shouldn't happen, and probably indicates a problem with the
      // middleware itself.
      default:
        MCD.warn( "Spurious reply from Middleware:", message );
        break;
    }
  };


  handleTaskResponse ( state, data ) {
    switch ( state.toUpperCase() ) {
      case "CREATED":
      this.onTaskCreated( data );
      break;

      case "UPDATED":
      this.onTaskUpdated( data );
      break;

      case "PROGRESS":
      this.onTaskProgress( data );
      break;
    }
  }

  // CONNECTION ERRORS
  // Triggered by the WebSocket's `onerror` event. Handles errors
  // With the client connection to the middleware.
  handleError ( error ) {
    if ( MCD.reports( "connection" ) ) {
      MCD.error( "The WebSocket connection to the Middleware encountered " +
                 "an error:"
               , [ "error" ]
               );
    }
  };

  // REQUEST TIMEOUTS
  // Called by a request function without a matching response. Automatically
  // triggers resolution of the request with a "timeout" status.
  handleTimeout ( reqID ) {

    if ( MCD.reports( "messages" ) ) {
      MCD.warn( `Request %c'${ reqID }'%c timed out without a response from ` +
                `the middleware`
              , [ "uuid", "normal" ]
              );
    }

    this.resolvePendingRequest( reqID, null, null, "timeout" );
  };

  // DATA AND REQUEST HANDLING

  // Creates a JSON-formatted object to send to the middleware. Contains the
  // following key-values:
  // "namespace": The target middleware namespace. (eg. "rpc", "events")
  // "name": Name of middleware action within the namespace
  //         (eg. "subscribe", "auth")
  // "args": The arguments to be used by the middleware action
  //         (eg. username and password)
  // "id": The unique UUID used to identify the origin and response If left
  //       blank, `generateUUID` will be called. This is a fallback, and will
  //       likely result in a "Spurious reply" error
  pack ( namespace, name, args, id ) {
    if ( MCD.reports( "packing" ) ) { MCD.logPack( ...arguments ); }

    return JSON.stringify(
      { namespace: namespace
      , name: name
      , id: id
      , args: args
      }
    );

  }

  // Based on the status of the WebSocket connection and the authentication
  // state, either logs and sends an action, or enqueues it until it can be sent
  processNewRequest ( action, onSuccess, onError, id, timeout ) {
    if ( this.socket && this.socket.readyState === 1 && this.isAuthenticated ) {

      if ( MCD.reports( "logging" ) ) {
        MCD.info( `Logging and sending request %c'${ id }'`
                , [ "uuid" ]
                );
        MCD.dir( action );
      }

      this.logPendingRequest( id, onSuccess, onError, action, timeout );
      this.socket.send( action );

    } else {

      if ( MCD.reports( "queues" ) ) {
        MCD.info( `Enqueueing request %c'${ id }'`, [ "uuid" ] );
      }

      this.queuedActions.push(
        { action: action
        , id: id
        , successCallback: onSuccess
        , errorCallback: onError
        , timeout: timeout
        }
      );

    }
  }

  // Many views' lifecycle will make a request before the connection is made,
  // and before the login credentials have been accepted. These requests are
  // enqueued by the `login` and `request` functions into the `queuedActions`
  // object and `queuedLogin`, and then are dequeued by this function.
  dequeueActions () {
    if ( MCD.reports( "queues" ) && this.queuedActions.length ) {
      MCD.log( "Attempting to dequeue actions" );
    }

    while ( this.queuedActions.length ) {
      let request = this.queuedActions.shift();

      if ( MCD.reports( "queues" ) ) {
        MCD.log( `Dequeueing %c'${ request.id }'`, [ "uuid" ] );
      }

      this.processNewRequest( request.action
                            , request.successCallback
                            , request.errorCallback
                            , request.id
                            , request.timeout
                            );
    }
  }

  // Records a middleware request that was sent to the server, stored in the
  // constructor's `pendingRequests` object. These are eventually resolved and
  // removed, either by a response from the server, or the timeout set here.
  // If `timeoutDelay` is provided, its value will be used for the timeout.
  // Otherwise, the default timeout (10s) is used.
  logPendingRequest ( reqID, onSuccess, onError, origReq, timeoutDelay ) {

    const delay = timeoutDelay || defaultTimeoutDelay;

    function requestTimeoutHandler () {
      this.handleTimeout( reqID );
    };

    this.pendingRequests[ reqID ] =
      { successCallback: onSuccess
      , errorCallback: onError
      , origReq: origReq
      , timeout: setTimeout( requestTimeoutHandler.bind( this ), delay )
      };

    if ( MCD.reports( "logging" ) ) {
      MCD.info( "Current pending requests:" );
      MCD.dir( this.pendingRequests );
    }
  }

  // Resolve a middleware request by clearing its timeout, and optionally
  // calling its callback. Callbacks should not be called if the function timed
  // out before a response was received.
  resolvePendingRequest ( reqID, args, timestamp, outcome ) {

    // The server side dispatcher will send a None in the reqID when returing
    // error (code 22): 'Request is not valid JSON'
    if ( reqID && this.pendingRequests[ reqID ] ) {
      clearTimeout( this.pendingRequests[ reqID ].timeout );
    }

    switch ( outcome ) {
      case "success":
        if ( MCD.reports( "messages" ) ) {
          MCD.info( `SUCCESS: Resolving request %c'${ reqID }'`, [ "uuid" ] );
        }
        this.executeRequestSuccessCallback( reqID, args, timestamp );
        break;

      case "error":
        let origReq;

        try {
          origReq = JSON.parse( this.pendingRequests[ reqID ]["origReq"] );
        } catch ( err ) {
          MCD.error( [ `Could not parse JSON from request %c'${ reqID }'`
                     , this.pendingRequests[ reqID ]["origReq"]
                     ]
                   , [ "uuid" ]
                   );
        }

        this.executeRequestErrorCallback( reqID, args, timestamp );

        if ( args.message && _.startsWith( args.message, "Traceback" ) ) {
          MCD.logPythonTraceback( reqID, args, origReq );
        } else if ( args.code && args.message ) {
          MCD.logErrorWithCode( reqID, args, origReq );
        } else {
          MCD.logErrorResponse( reqID, args, origReq );
        }
        break;

      case "timeout":
        MCD.warn( `TIMEOUT: Stopped waiting for request %c'${ reqID }'`
                , [ "uuid" ]
                );
        this.executeRequestErrorCallback( reqID, args );
        break;

      default:
        break;
    }

    delete this.pendingRequests[ reqID ];
  }

  // Executes the specified request's successCallback with the provided
  // arguments. Should only be used in cases where a response has come from the
  // server, and the status is successful in one way or another. Calling this
  // function when the server returns an error could cause strange results.
  // Use the errorCallback for that case.
  executeRequestSuccessCallback ( reqID, args, timestamp ) {
    if ( _.isFunction( this.pendingRequests[ reqID ].successCallback ) ) {
      this.pendingRequests[ reqID ].successCallback( args, timestamp );
    }
  }

  executeRequestErrorCallback ( reqID, args ) {
    if ( _.isFunction( this.pendingRequests[ reqID ].errorCallback ) ) {
      this.pendingRequests[ reqID ].errorCallback( args );
    }
  }

  // Authenticate a user to the middleware. Basically a specialized version of
  // the `request` function with a different payload.
  login ( namespace, payload, success, failure ) {
    const reqID = freeNASUtil.generateUUID();
    const action = this.pack( "rpc", namespace, payload, reqID );

    if ( this.socket.readyState === 1 ) {

      if ( MCD.reports( "authentication" ) ) {
        MCD.info( "Socket is ready: Sending login request." );
      }

      this.logPendingRequest( reqID, success, failure, action, null );
      this.socket.send( action );
    } else {

      if ( MCD.reports( "authentication" ) ) {
        MCD.info( "Socket is not ready: Deferring login request." );
      }

      this.queuedLogin = { action: action
                         , successCallback: success
                         , errorCallback: failure
                         , id: reqID
                         };
    }
  }

  logout () {
    // Deletes the login cookie (which contains the token) and closes the socket
    // connection
    sessionCookies.delete( "auth" );
    this.disconnect( 1000, "User logged out" );
    this.changeAuth( false );
    this.onLogout();
  }

  // CHANNELS AND REQUESTS
  // Make a request to the middleware, which translates to an RPC call. A
  // unique UUID is generated for each request, and is supplied to
  // `this.logPendingRequest` as a lookup key for resolving or timing out the
  // Request.
  request ( method, args, onSuccess, onError, timeoutDelay ) {
    const reqID = freeNASUtil.generateUUID();
    const payload = { method, args };
    const packedAction = this.pack( "rpc", "call", payload, reqID );

    this.processNewRequest( packedAction
                          , onSuccess
                          , onError
                          , reqID
                          , timeoutDelay
                          );
  }

  // TASK SUBMISSION
  submitTask ( args ) {
    if ( !UUID ) {
      console.warn( "A UUID must be provided for submitTask" );
      return;
    }

    const PAYLOAD = { method: [ "task.submit" ], args };

    this.onTaskSubmitRequest( UUID, args );

    this.processNewRequest( this.pack( "rpc", "call", PAYLOAD, UUID )
                          , this.onTaskSubmitSuccess.bind( this )
                          , this.onTaskSubmitFailure.bind( this )
                          );
  }


  // SUBSCRIPTION INTERFACES
  // Generic interface for subscribing to Middleware namespaces. The Middleware
  // Flux store records the number of React components which have required a
  // subscription to a Middleware namespace. This allows the Middleware Client
  // to make intelligent decisions about whether to query a namespace for fresh
  // data, begin or end a subscription, or even garbage collect a Flux store
  // which is no longer being used.

  subscribe ( masks, componentID ) {

    if ( !_.isArray( masks ) ) {
      MCD.error( "The first argument in MiddlewareClient.subscribe() must " +
                 "be an array of FreeNAS RPC namespaces."
                 );
      return false;
    } else if ( _.isEmpty( masks ) ) {
      MCD.warn( "The array of masks to subscribe to must have at least one "
              + "element. The componentID making this mistake is "
              + componentID
              );
      return false;
    }

    if ( !_.isString( componentID ) ) {
      MCD.error( "The second argument in MiddlewareClient.subscribe() must " +
                 "be a string (usually the name of the React component " +
                 "calling it)."
                 );
      return false;
    }

    if ( MCD.reports( "subscriptions" ) ) {
      MCD.logNewSubscriptionMasks( masks );
    }

    _.forEach( masks, function ( mask ) {
      if ( mask === "" ) {
        MCD.warn( componentID + " tried to subscribe to an empty mask." );
      }
      let subCount = SubscriptionsStore.getNumberOfSubscriptionsForMask( mask );

      if ( MCD.reports( "subscriptions" ) ) {
        MCD.logSubscription( subCount, mask );
      }

      if ( subCount < 1 ) {
        const reqID = freeNASUtil.generateUUID();
        const action = this.pack( "events", "subscribe", [ mask ], reqID );

        this.processNewRequest( action, null, null, reqID, null );
      }
    }, this );

    SubscriptionsActionCreators.recordNewSubscriptions( masks, componentID );
  }

  unsubscribe ( masks, componentID ) {

    if ( !_.isArray( masks ) ) {
      MCD.warn( "The first argument in MiddlewareClient.unsubscribe() must " +
                "be an array of FreeNAS RPC namespaces."
              );
      return;
    } else if ( _.isEmpty( masks ) ) {
      MCD.warn( "The array of masks to unsubscribe from must have at least one "
              + "element. The componentID making this mistake is "
              + componentID
              );
      return;
    }

    if ( !_.isString( componentID ) ) {
      MCD.warn( "The second argument in MiddlewareClient.unsubscribe() must " +
                "be a string (usually the name of the React component " +
                "calling it)."
              );
      return;
    }

    if ( MCD.reports( "subscriptions" ) ) {
      MCD.logUnsubscribeMasks( masks );
    }

    _.forEach( masks, function ( mask ) {
      if ( mask === "" ) {
        MCD.warn( componentID + " tried to unsubscribe from an empty mask." );
      }
      let subCount = SubscriptionsStore.getNumberOfSubscriptionsForMask( mask );

      if ( subCount === 1 ) {
        const reqID = freeNASUtil.generateUUID();
        const action = this.pack( "events", "unsubscribe", [ mask ], reqID );

        this.processNewRequest( action, null, null, reqID, null );
      }
    }, this );

    SubscriptionsActionCreators.deleteCurrentSubscriptions( masks
                                                          , componentID
                                                          );
  }

  renewSubscriptions () {
    const masks = _.keys( SubscriptionsStore.getAllSubscriptions() );
    _.forEach( masks, function ( mask ) {
      if ( MCD.reports( "subscriptions" ) ) {
        MCD.log( `Renewing subscription request for %c'${ mask }' `
               , [ "args", "normal" ]
               );
      }

      const reqID = freeNASUtil.generateUUID();
      const action = this.pack( "events", "subscribe", [ mask ], reqID );

      this.processNewRequest( action, null, null, reqID, null );
    }, this );
  }

  unsubscribeALL () {
    const masks = _.keys( SubscriptionsStore.getAllSubscriptions() );
    _.forEach( masks, function ( mask ) {
      if ( MCD.reports( "subscriptions" ) ) {
        MCD.log( `Requested: Unsubscribe to %c'${ mask }'%c events`
               , [ "args", "normal" ]
               );
      }

      const reqID = freeNASUtil.generateUUID();
      const action = this.pack( "events", "unsubscribe", [ mask ], reqID );

      this.processNewRequest( action, null, null, reqID, null );
    }, this );

    SubscriptionsActionCreators.deleteAllSubscriptions();
  }

  // MIDDLEWARE DISCOVERY METHODS
  // These are instance methods used to request information about the
  // Middleware server's capabilities and overall state. These can be used to
  // return a list of services supported by your connection to the middleware,
  // and methods supported by each service.

  getSchemas () {
    this.request( "discovery.get_schema"
                , []
                , MiddlewareActionCreators.receiveSchemas
                );
  };

  getServices () {
    this.request( "discovery.get_services"
                , []
                , MiddlewareActionCreators.receiveServices
                );
  };

  getMethods ( service ) {
    this.request( "discovery.get_methods"
                , [ service ]
                , MiddlewareActionCreators.receiveMethods.bind( null, service )
                );
  };

}

export default new MiddlewareClient();
