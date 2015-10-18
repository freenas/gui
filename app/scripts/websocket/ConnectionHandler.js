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
    this.shouldReconnect = false;
    this.store = store;

    this.store.subscribe( this.handleSocketStateChange.bind( this ) );
  }

  handleSocketStateChange () {
    const { middleware } = this.store.getState();
    // Cache and compare last state value to determine if timeout should be run
    let prevShouldReconnect = this.shouldReconnect;
    this.shouldReconnect = middleware.shouldReconnect;

    if ( this.shouldReconnect
      && this.shouldReconnect !== prevShouldReconnect ) {
      this.connectionTimeout();
    }
  }

  connectionTimeout () {
    const { middleware } = this.store.getState();
    clearTimeout( this.timeout );
    this.timeout = null;

    if ( middleware.reconnectTime === 0 ) {
      this.store.dispatch( actions.attemptConnection() );
      MiddlewareClient.connect( middleware.protocol, middleware.host, middleware.path );
    } else {
      this.store.dispatch( actions.reconnectTick() );
      this.timeout = setTimeout( () => { this.connectionTimeout() }, 1000 );
    }
  }
};

export default ConnectionHandler;
