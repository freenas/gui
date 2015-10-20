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
import * as authActions from "./actions/auth";
import * as middlewareActions from "./actions/middleware";
import * as tasksActions from "./actions/tasks";

import routes from "./routes";
import TargetHost from "./websocket/TargetHost";
import ConnectionHandler from "./websocket/ConnectionHandler";
import MiddlewareClient from "./websocket/MiddlewareClient";

if ( process.env.BROWSER ) {
  const store = configureStore();
  const reconnect = new ConnectionHandler( store );
  const history = createBrowserHistory();
  const { protocol, host, path, mode } = TargetHost.connection();

  store.dispatch( middlewareActions.changeSockTarget({ protocol, host, path, mode }) );

  MiddlewareClient.bindHandlers(
    { onSockStateChange: ( state, closeEvent ) =>
        store.dispatch( middlewareActions.changeSockState( state, closeEvent ) )
    , onLogout: () =>
        store.dispatch( authActions.logout() )


    // TASK SUBMISSION HANDLERS
    , onTaskSubmitRequest: ( UUID, args ) =>
        store.dispatch( tasksActions.taskSubmitRequest( UUID, args ) )
    , onTaskSubmitSuccess: ( UUID, taskID, timestamp ) =>
        store.dispatch( tasksActions.taskSubmitSuccess( UUID, taskID, timestamp ) )
    , onTaskSubmitFailure: ( UUID, args, timestamp ) =>
        store.dispatch( tasksActions.taskSubmitFailure( UUID, args, timestamp ) )
    // TODO: lol implying
    // , onTaskSubmitTimeout: () =>
    //     store.dispatch( tasksActions.onTaskSubmitTimeout() )


    // TASK UPDATE HANDLERS
    , onTaskCreated : () =>
        store.dispatch( tasksActions.taskCreated( data ) )
    , onTaskUpdated : () =>
        store.dispatch( tasksActions.taskUpdated( data ) )
    , onTaskProgress: () =>
        store.dispatch( tasksActions.taskProgress( data ) )
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
