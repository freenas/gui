// FREENAS MIDDLEWARE SIMULATOR
// ============================

"use strict";

var chalk = require( "chalk" );
var WebSocketServer = require( "ws" ).Server;

var middleware = new WebSocketServer({ port: 4444, path: "/simulator" });

var systemGenerator = require( "./templates/system.js" );

// Temporary hard-coded inputs for the system generator.
var diskCount = 8;
var diskTypes = "both";

var virtualSystem = systemGenerator( diskCount, diskTypes );

var authTokens = {};

function handleRPC ( data, flags ) {
  var args;
  switch ( data.name ) {
    case "auth_token":
      if ( authTokens[ data["auth_token"] ] ) {
        var token = generateToken();
        authTokens[ token ] = authTokens[ data["auth_token"] ];
        args = [ token, 600, authTokens[ data["auth_token"] ] ];
        delete authTokens[ data["auth_token"] ];
        this.send( pack( "rpc", "response", args, data.id ) );
      } else {
        // FIXME
        return false;
      }
      break;

    case "auth":
      var token = generateToken();
      authTokens[ token ] = data.args["username"];
      args = [ token, 600, data.args["username"] ];
      this.send( pack( "rpc", "response", args, data.id ) );
      break;
  }
  return true;
}

function generateToken () {
  Array( 32 ).join(
    ( Math.random().toString( 36 ) + "00000000000000000" ).slice( 2, 18 )
  ).slice( 0, 32 );
}

function handleOpen () {
  // TODO
};

function handleClose ( code, message ) {
  var explanation = "";

  switch ( code ) {
    case 1000:
      explanation = "Normal closure; the connection successfully completed "
                  + "whatever purpose for which it was created.";
      break;

    case 1001:
      explanation = "The endpoint is going away, either because of a server "
                  + "failure or because the browser is navigating away from "
                  + "the page that opened the connection.";
      break;

    case 1002:
      explanation = "The endpoint is terminating the connection due to a "
                  + "protocol error.";
      break;

    case 1003:
      explanation = "The connection is being terminated because the endpoint "
                  + "received data of a type it cannot accept (for example, "
                  + "a text-only endpoint received binary data).";
      break;

    case 1005:
      explanation = "Reserved.  Indicates that no status code was provided "
                  + "even though one was expected.";
      break;

    case 1006:
      explanation = "Reserved. Used to indicate that a connection was closed "
                  + "abnormally (that is, with no close frame being sent) "
                  + "when a status code is expected.";
      break;

    case 1007:
      explanation = "The endpoint is terminating the connection because a "
                  + "message was received that contained inconsistent data "
                  + "(e.g., non-UTF-8 data within a text message).";
      break;

    case 1008:
      explanation = "The endpoint is terminating the connection because it "
                  + "received a message that violates its policy. This is "
                  + "a generic status code, used when codes 1003 and 1009 are "
                  + "not suitable.";
      break;

    case 1009:
      explanation = "The endpoint is terminating the connection because a "
                  + "data frame was received that is too large.";
      break;

    case 1010:
      explanation = "The client is terminating the connection because it "
                  + "expected the server to negotiate one or more extension, "
                  + "but the server didn't.";
      break;

    case 1011:
      explanation = "The server is terminating the connection because it "
                  + "encountered an unexpected condition that prevented it "
                  + "from fulfilling the request.";
      break;
  }

  console.log( "WebSocket connection closed: " + chalk.cyan( "Code " + code ) );
  if ( explanation ) {
    console.log( explanation );
  };
  if ( message ) {
    console.log( message );
  };
};

function handleError ( error ) {
  console.log( "WebSocket error" );
  console.error( error );
};

function handleMessage ( message, flags ) {
  var data;
  var args;

  try {
    data = JSON.parse( message );
  } catch ( error ) {
    console.error( "Could not parse JSON from message:", message );
    return false;
  }

  switch ( data.namespace ) {
    case "rpc":
      handleRPC.call( this, data, flags );
      break;
  }
};

function pack ( namespace, name, args, id ) {
  return JSON.stringify(
    { namespace : namespace
    , name      : name
    , id        : id
    , args      : args
    , timestamp : Math.floor( ( new Date ).getTime() / 1000 )
    }
  );
}

middleware.on( "connection", function ( socket ) {
  socket.on( "open", handleOpen.bind( socket ) );
  socket.on( "close", handleClose.bind( socket ) );
  socket.on( "error", handleError.bind( socket ) );
  socket.on( "message", handleMessage.bind( socket ) );
});
