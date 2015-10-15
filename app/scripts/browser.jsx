// CLIENT ENTRYPOINT
// =================
// Counterpart to ./index.js. client provides interface to the rest of the app,
// and wraps the app's routes component.

"use strict";

require( "babel/polyfill" );

import React from "react";
import ReactDOM from "react-dom";
import { Router } from "react-router";
import { createStore } from "redux";
import { Provider } from "react-redux";
import createBrowserHistory from "history/lib/createBrowserHistory";

import rootReducer from "./redux/rootReducer";
import routes from "./routes";
import TargetHost from "./websocket/TargetHost";
import ConnectionHandler from "./websocket/ConnectionHandler";
import MiddlewareClient from "./websocket/MiddlewareClient";

if ( process.env.BROWSER ) {
  let store = createStore( rootReducer );
  let { protocol, host, path, mode } = TargetHost.connection();
  let history = createBrowserHistory();

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
