// CLIENT ENTRYPOINT
// =================
// Counterpart to ./index.js. client provides interface to the rest of the app,
// and wraps the app's routes component.

"use strict";

require( "babel/polyfill" );

import React from "react";

// Routing
import Router, { HistoryLocation } from "react-router";
import Routes from "./routes.jsx";

import TargetHost from "./websocket/TargetHost";
import ConnectionHandler from "./websocket/ConnectionHandler";
import MiddlewareClient from "./websocket/MiddlewareClient";

if ( process.env.BROWSER ) {
  let { protocol, host, path, mode } = TargetHost.connection();

  MiddlewareClient.connect( protocol, host, path, mode );
  MiddlewareClient.subscribe(
    [ "task.created"
    , "task.updated"
    , "task.progress"
    ]
    , "WEBAPP"
  );

  Router.run( Routes
            , HistoryLocation
            , function ( Handler, state ) {
                React.render( <Handler />, document );
              }
            );
}
