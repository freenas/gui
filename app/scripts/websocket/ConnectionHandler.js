// MIDDLEWARE RECONNECT HANDLER
// ============================
// An independent atomic watcher which controls the reconnection lifecycle of
// the WebSocket connection to the FreeNAS Middleware.

"use strict";

import MiddlewareClient from "./MiddlewareClient";
import * as ACTIONS from "../actions/websocket";

// Time in ms before a reconnect is attempted
const RECONNECT_INTERVALS = [ 5000, 8000, 13000, 21000, 34000 ];

class ConnectionHandler {
  constructor ( store ) {
    this.timeout = null;
    this.reconnectNow = false;
    this.store = store;

    this.store.subscribe( this.handleSocketStateChange.bind( this ) );
  }

  handleSocketStateChange () {
    const { websocket } = this.store.getState();
    // Cache and compare last state value to determine if timeout should be run
    let prevReconnectNow = this.reconnectNow;
    this.reconnectNow = websocket.reconnectNow;

    if ( this.reconnectNow
      && this.reconnectNow !== prevReconnectNow ) {
      this.connectionTimeout();
    }
  }

  connectionTimeout () {
    const { websocket } = this.store.getState();
    clearTimeout( this.timeout );
    this.timeout = null;

    if ( websocket.reconnectTime === 0 ) {
      this.store.dispatch( ACTIONS.attemptConnection() );
      MiddlewareClient.connect( websocket.protocol, websocket.host, websocket.path );
    } else {
      this.store.dispatch( ACTIONS.reconnectTick() );
      this.timeout = setTimeout( () => { this.connectionTimeout() }, 1000 );
    }
  }
};

export default ConnectionHandler;
