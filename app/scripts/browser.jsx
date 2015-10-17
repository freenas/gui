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
import * as middlewareActions from "./actions/middleware";
import * as authActions from "./actions/auth";
import routes from "./routes";
import TargetHost from "./websocket/TargetHost";
import ConnectionHandler from "./websocket/ConnectionHandler";
import MiddlewareClient from "./websocket/MiddlewareClient";

if ( process.env.BROWSER ) {
  let store = configureStore();
  let history = createBrowserHistory();
  let { protocol, host, path, mode } = TargetHost.connection();

  MiddlewareClient.bindHandlers( store
    , { onSockStateChange: ( state ) =>
          store.dispatch( middlewareActions.changeSockState( state ) )
      , onSockTargetChange: ( targetData ) =>
          store.dispatch( middlewareActions.changeSockTarget( targetData ) )
      , onLogout: () =>
          store.dispatch( authActions.logout() )
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
