// MIDDLEWARE RECONNECT HANDLER
// ============================
// An independent atomic watcher which controls the reconnection lifecycle of
// the WebSocket connection to the FreeNAS Middleware.

"use strict";

import MiddlewareClient from "./MiddlewareClient";
import * as actions from "../actions/middleware";

// Time in ms before a reconnect is attempted
const RECONNECT_INTERVALS = [ 5000, 8000, 13000, 21000, 34000 ];

class ConnectionHandler {
  constructor ( store ) {
    this.timeout = null;
    this.lastState = null;
    this.store = store;

    this.store.subscribe( this.handleSocketStateChange.bind( this ) );
  }

  handleSocketStateChange () {
    const { middleware } = this.store.getState();

    if ( middleware.readyState !== this.lastState
      && middleware.readyState === "CLOSED" ) {
      this.lastState = middleware.readyState;
      clearTimeout( this.timeout );

      if ( middleware.connectionAttempts === 0 ) {
        this.attemptConnection();
      } else {
        this.connectionTimeout();
      }
    }

    // Cache the current state for comparison purposes in the future
    this.lastState = middleware.readyState;
  }

  connectionTimeout () {
    const { reconnectTime } = this.store.getState().middleware;

    if ( reconnectTime === 0 ) {
      this.attemptConnection();
    } else {
      this.store.dispatch( actions.reconnectTick() );
      this.timeout = setTimeout( () => this.connectionTimeout, 1000 );
    }
  }

  attemptConnection () {
    const { protocol, host, path } = this.store.getState().middleware;

    if ( protocol && host && path ) {
      this.store.dispatch( actions.attemptConnection() );
      MiddlewareClient.connect( protocol, host, path );
    } else {
      console.warn( "Could not create connect to FreeNAS Middleware with the "
                  + "supplied parameters:"
                  );
      console.dir({ protocol, host, path });
    }
  }
};

export default ConnectionHandler;
