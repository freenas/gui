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
import * as actions from "./actions/middleware";
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
          store.dispatch( actions.changeSockState( state ) )
      , onSockTargetChange: ( targetData ) =>
          store.dispatch( actions.changeSockTarget( targetData ) )
      }
    );

  MiddlewareClient.connect( protocol, host, path, mode );
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

}
