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
import * as AA from "./actions/auth";
import * as WA from "./actions/websocket";
import * as TA from "./actions/tasks";

import routes from "./routes";
import TargetHost from "./websocket/TargetHost";
import ConnectionHandler from "./websocket/ConnectionHandler";
import MiddlewareClient from "./websocket/MiddlewareClient";

if ( process.env.BROWSER ) {
  const store = configureStore();
  const reconnect = new ConnectionHandler( store );
  const history = createBrowserHistory();
  const { protocol, host, path, mode } = TargetHost.connection();

  store.dispatch( WA.changeSockTarget({ protocol, host, path, mode }) );

  MiddlewareClient.bindHandlers(
    { onSockStateChange: ( state, closeEvent ) =>
        store.dispatch( WA.changeSockState( state, closeEvent ) )
    , onLogout: () =>
        store.dispatch( AA.logout() )


    // TASK SUBMISSION HANDLERS
    , onTaskSubmitRequest: ( UUID, args ) =>
        store.dispatch( TA.taskSubmitRequest( UUID, args ) )
    , onTaskSubmitSuccess: ( UUID, taskID, timestamp ) =>
        store.dispatch( TA.taskSubmitSuccess( UUID, taskID, timestamp ) )
    , onTaskSubmitFailure: ( UUID, args, timestamp ) =>
        store.dispatch( TA.taskSubmitFailure( UUID, args, timestamp ) )
    // TODO: lol implying
    // , onTaskSubmitTimeout: () =>
    //     store.dispatch( TA.onTaskSubmitTimeout() )


    // TASK UPDATE HANDLERS
    , onTaskCreated : () =>
        store.dispatch( TA.taskCreated( data ) )
    , onTaskUpdated : () =>
        store.dispatch( TA.taskUpdated( data ) )
    , onTaskProgress: () =>
        store.dispatch( TA.taskProgress( data ) )
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
