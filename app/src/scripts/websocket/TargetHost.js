// CONNECTED HOST
// ==============
// Return an object containing information for all of the webapp's target
// connections. Reduces boilerplate around forming multiple WebSocket
// connections and prevents insanity (like using document.domain).

"use strict";

export default class TargetHost {
  static connection () {
    if ( process.env.BROWSER ) {
      // window["__DEVELOPMENT_CONNECTION__"] is either a hostname or the string
      // "SIMULATION_MODE", if defined. The fallthrough assigns "self", an
      // indication that no development mode is active, and the client should try
      // to connect to its own host with no special preparations.
      const TARGET = window["__DEVELOPMENT_CONNECTION__"] || "self";

      let connection = {};

      switch ( TARGET ) {
        case "self":
          connection.protocol = ( window.location.protocol === "https:" )
                   ? "wss://"
                   : "ws://";
          connection.host = document.domain;
          connection.path = ":5000/socket";
          connection.mode = "STANDARD";
          break;

        case "SIMULATION_MODE":
          connection.protocol = "ws://";
          connection.host  = document.domain;
          connection.path = ":4444/simulator";
          connection.mode = "SIMULATION_MODE";
          break;

        default:
          connection.protocol = "ws://";
          connection.host = TARGET;
          connection.path = ":5000/socket";
          connection.mode = "CONNECT_TO_TARGET";
          break;
      }

      return connection;
    } else {
      return null;
    }
  }
}
