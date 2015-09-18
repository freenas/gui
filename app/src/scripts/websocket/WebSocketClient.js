// WEBSOCKET CLIENT
// ================
// A simple base class for the WebSocket clients used by FreeNAS 10. Implements
// some shared functionality that all WS clients rely on.

"use strict";

import _ from "lodash";

import DebugLogger from "../utility/DebugLogger";
import WSCodes from "./WebSocketCodes";

const DL = new DebugLogger( "MIDDLEWARE_CLIENT_DEBUG" );

class WebSocketClient {

  constructor () {
    this.socket = null;
  }

  // This method should only be called when there's no existing connection.
  connect ( protocol = "ws://", host = "", path = "" ) {
    if ( "WebSocket" in window ) {
      let target = protocol + host + path;

      if ( DL.reports( "connection" ) ) {
        DL.info( "Creating WebSocket connection to " + target );
      }

      this.socket = new WebSocket( target );

      if ( this.socket instanceof WebSocket) {
        _.assign( this.socket
                , { onopen: this.handleOpen.bind( this )
                  , onmessage: this.handleMessage.bind( this )
                  , onerror: this.handleError.bind( this )
                  , onclose: this.handleClose.bind( this )
                  }
                , this
                );
      } else {
        throw new Error( "Was unable to create a WebSocket instance" );
      }
    } else {
      // TODO: Visual error for legacy browsers with links to download others
      DL.error( "This environment doesn't support WebSockets." );
    }
  };

  // Shortcut method for closing the WebSocket connection.
  disconnect ( code, reason ) {
    this.socket.close( code, reason );
  };

  handleOpen () {}
  handleMessage () {}
  handleError () {}
  handleClose () {}

}

export default WebSocketClient;
