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
import * as auth from "./actions/auth";
import * as websocket from "./actions/websocket";
import * as rpc from "./actions/rpc";
import * as tasks from "./actions/tasks";

import routes from "./routes";
import TargetHost from "./websocket/TargetHost";
import ConnectionHandler from "./websocket/ConnectionHandler";
import MiddlewareClient from "./websocket/MiddlewareClient";

const ACTIONS = { ...auth, ...websocket, ...rpc, ...tasks };

if ( process.env.BROWSER ) {
  const store = configureStore();
  const reconnect = new ConnectionHandler( store );
  const history = createBrowserHistory();
  const { protocol, host, path, mode } = TargetHost.connection();

  store.dispatch( ACTIONS.changeSockTarget({ protocol, host, path, mode }) );

  MiddlewareClient.bindStore( store );

  MiddlewareClient.bindHandlers(
    { onSockStateChange: ( state, closeEvent ) =>
        store.dispatch( ACTIONS.changeSockState( state, closeEvent ) )
    , onLogout: () =>
        store.dispatch( ACTIONS.logout() )


    // RPC QUEUE
    , onRPCEnqueue: ( request ) =>
        store.dispatch( ACTIONS.enqueueRPCRequest( request ) )
    , onRPCDequeue: () =>
        store.dispatch( ACTIONS.dequeueRPCRequests() )

    // RPC LIFECYCLE
    , onRPCRequest: ( UUID, params ) =>
        store.dispatch( ACTIONS.submitRPCRequest( UUID, params ) )
    , onRPCSuccess: ( UUID, data ) =>
        store.dispatch( ACTIONS.submitRPCSuccess( UUID, data ) )
    , onRPCFailure: ( UUID, error ) =>
        store.dispatch( ACTIONS.submitRPCFailure( UUID, error ) )
    , onRPCTimeout: ( UUID, error ) =>
        store.dispatch( ACTIONS.submitRPCTimeout( UUID, error ) )


    // TASK UPDATE HANDLERS
    , onTaskCreated : () =>
        store.dispatch( ACTIONS.taskCreated( data ) )
    , onTaskUpdated : () =>
        store.dispatch( ACTIONS.taskUpdated( data ) )
    , onTaskProgress: () =>
        store.dispatch( ACTIONS.taskProgress( data ) )
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
