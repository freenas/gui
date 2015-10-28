// CLIENT ENTRYPOINT
// =================
// Counterpart to ./index.js. client provides interface to the rest of the app,
// and wraps the app's routes component.

"use strict";

require( "babel/polyfill" );

import React from "react";
import ReactDOM from "react-dom";
import { Router } from "react-router";
import { Provider } from "react-redux";
import createBrowserHistory from "history/lib/createBrowserHistory";

import configureStore from "./store/configureStore";
import * as AUTH from "./actions/auth";
import * as SUBSCRIPTIONS from "./actions/subscriptions";
import * as RPC from "./actions/rpc";
import * as STATD from "./actions/statd";
import * as TASKS from "./actions/tasks";
import * as WEBSOCKET from "./actions/websocket";

import routes from "./routes";
import TargetHost from "./websocket/TargetHost";
import ConnectionHandler from "./websocket/ConnectionHandler";
import MiddlewareClient from "./websocket/MiddlewareClient";

if ( process.env.BROWSER ) {
  const store = configureStore();
  const reconnect = new ConnectionHandler( store );
  const history = createBrowserHistory();
  const { protocol, host, path, mode } = TargetHost.connection();

  store.dispatch( WEBSOCKET.changeSockTarget({ protocol, host, path, mode }) );

  MiddlewareClient.bindStore( store );

  MiddlewareClient.bindHandlers(
    { onSockStateChange: ( state, closeEvent ) =>
      store.dispatch( WEBSOCKET.changeSockState( state, closeEvent ) )

    , onLogout: () =>
      store.dispatch( AUTH.logout() )


    // RPC QUEUE
    , onRPCEnqueue: ( request ) =>
      store.dispatch( RPC.enqueueRPCRequest( request ) )
    , onRPCDequeue: () =>
      store.dispatch( RPC.dequeueRPCRequests() )

    // RPC LIFECYCLE
    , onRPCRequest: ( UUID, params ) =>
      store.dispatch( RPC.submitRPCRequest( UUID, params ) )
    , onRPCSuccess: ( UUID, data ) =>
      store.dispatch( RPC.submitRPCSuccess( UUID, data ) )
    , onRPCFailure: ( UUID, error ) =>
      store.dispatch( RPC.submitRPCFailure( UUID, error ) )
    , onRPCTimeout: ( UUID, error ) =>
      store.dispatch( RPC.submitRPCTimeout( UUID, error ) )


    // TASK UPDATE HANDLERS
    , onTaskCreated: ( data ) =>
      store.dispatch( TASKS.taskCreated( data ) )
    , onTaskUpdated: ( data ) =>
      store.dispatch( TASKS.taskUpdated( data ) )
    , onTaskProgress: ( data ) =>
      store.dispatch( TASKS.taskProgress( data ) )
    , onTaskFinished: ( data ) =>
      store.dispatch( TASKS.taskFinished( data ) )
    , onTaskFailed: ( data ) =>
      store.dispatch( TASKS.taskFailed( data ) )

    // STATD PULSE HANDLERS
    , onStatdPulse: ( source, pulse ) =>
      store.dispatch( STATD.pulse( source, pulse ) )

    // ENTITY-SUBSCRIBER HANDLERS
    , onEntityChanged: ( mask, data ) =>
      store.dispatch( SUBSCRIPTIONS.entityChanged( mask, data ) )
    }
  );

  MiddlewareClient.subscribe(
    [ "task.created"
    , "task.updated"
    , "task.progress"
    ]
    , "WEBAPP"
  );

  ReactDOM.render(
    <Provider store={ store }>
      <Router history={ history } routes={ routes } />
    </Provider>
    , document
  );

  // Connecting the middleware client must be the last action taken. Because of
  // the way it mutates the global state, we need to ensure that the app is
  // rendered at least once with initial (isomorphic) values before any changes.
  MiddlewareClient.connect( protocol, host, path, mode );
}
