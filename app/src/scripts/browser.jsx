// CLIENT ENTRYPOINT
// =================
// Counterpart to ./index.js. client provides interface to the rest of the app,
// and wraps the app's routes component.

"use strict";

require( "babel/polyfill" );

import React from "react";

// Routing
import Router, { HistoryLocation } from "react-router";
import Routes from "./routes";

import MiddlewareClient from "./websocket/MiddlewareClient";

if ( typeof window !== "undefined" ) {
  window.onload = function () {
    // window["__DEVELOPMENT_CONNECTION__"] is either a hostname or the string
    // "SIMULATION_MODE", if defined. The fallthrough assigns "self", an
    // indication that no development mode is active, and the client should try
    // to connect to its own host with no special preparations.
    let target = window["__DEVELOPMENT_CONNECTION__"] || "self";

    let protocol;
    let url;
    let path;
    let mode;

    switch ( target ) {
      case "self":
        protocol = ( window.location.protocol === "https:" )
                 ? "wss://"
                 : "ws://";
        url = document.domain;
        path = ":5000/socket";
        mode = "STANDARD";
        break;

      case "SIMULATION_MODE":
        mode = "SIMULATION_MODE";
        break;

      default:
        protocol = "ws://";
        url = target;
        path = ":5000/socket";
        mode = "CONNECT_TO_TARGET";
        break;
    }

    MiddlewareClient.connect( protocol, url, path, mode );

    Router.run( Routes
              , HistoryLocation
              , function ( Handler, state ) {
                  React.render( <Handler />, document );
                }
              );
  };
}
