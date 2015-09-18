// MIDDLEWARE RECONNECT HANDLER
// ============================
// An independent atomic watcher which controls the reconnection lifecycle of
// the WebSocket connection to the FreeNAS Middleware.

"use strict";

import MiddlewareClient from "./MiddlewareClient";

import MS from "../flux/stores/MiddlewareStore";
import MAC from "../flux/actions/MiddlewareActionCreators";

// Time in ms before a reconnect is attempted
const RECONNECT_INTERVALS = [ 5000, 8000, 13000, 21000, 34000 ];

class ConnectionHandler {
  constructor () {
    this.timeout = null;
    this.remainingTime = 0;
    this.reconnectAttempts = 0;
    this.lastKnownStatus = null;

    MS.addChangeListener( this.handleSocketStateChange.bind( this ) );
  }

  handleSocketStateChange ( changeMask ) {
    if ( changeMask === "SOCKET_STATE" && MS.status !== this.lastKnownStatus ) {
      clearTimeout( this.timeout );
      this.timeout = null;
      this.lastKnownStatus = MS.status;

      switch ( MS.status ) {
        case "DISCONNECTED":
          if ( this.reconnectAttempts === 0 ) {
            this.attemptConnection();
          } else {
            this.connectionTimeout();
          }
          break;

        case "CONNECTING":
          let lastReconnectIndex = RECONNECT_INTERVALS.length - 1;
          this.remainingTime = ( this.reconnectAttempts < lastReconnectIndex )
                             ? RECONNECT_INTERVALS[ this.reconnectAttempts ]
                             : RECONNECT_INTERVALS[ lastReconnectIndex ];
          this.reconnectAttempts++;
          break;

        case "CONNECTED":
          this.remainingTime = 0;
          this.reconnectAttempts = 0;
          break;
      }
    }
  }

  connectionTimeout () {
    if ( this.remainingTime === 0 ) {
      this.attemptConnection();
    } else {
      this.remainingTime = Math.max( 0, this.remainingTime - 1000 );
      MAC.updateReconnectTime( this.remainingTime );
      this.timeout = setTimeout( this.connectionTimeout.bind( this ), 1000 );
    }
  }

  attemptConnection () {
    let { protocol, host, path } = MS;

    if ( protocol && host && path ) {
      MiddlewareClient.connect( protocol, host, path );
    } else {
      console.warn( "Could not create connect to FreeNAS Middleware with the "
                  + "supplied parameters:"
                  );
      console.dir({ protocol, host, path });
    }
  }
};

export default new ConnectionHandler();
