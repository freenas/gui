// MANAGE WEBSERVER LIFECYCLE
// ==========================
// Gulp task to control the lifecycle of the FreeNAS webserver.

"use strict";

var _       = require( "lodash" );
var gulp    = require( "gulp" );
var watch   = require( "gulp-watch" );
var Monitor = require( "forever-monitor" ).Monitor;
var chalk   = require( "chalk" );
var argv    = require( "yargs" ).argv;

var TAG = chalk.bgWhite.black( "  WEBSERVER  " ) + " ";

var localServer;
var buildChangeHandler = function ( vinyl ) {
  if ( localServer && localServer.restart ) {
    console.log( TAG + chalk.blue( "[ WATCH ] " )
               + "Issuing restart command"
               );
    localServer.restart();
  }
};

gulp.task( "serve", function () {
  var mode;
  var host;

  watch( [ "app/build/babel/**/*"
         , "app/build/app.js"
         , "app/build/libs.js"
         , "app/server.js"
         ]
       , _.debounce( buildChangeHandler, 3000 ) );

  if ( argv["connect"] ) {
    mode = "connect";
    host = argv["connect"];
  } else {
    mode = "local"; // FIXME: Hardcoded for now
  }

  switch ( mode ) {
    case "local":
    case "connect":
      // TODO: Enable the passing of an IP/hostname to server.

      console.log( TAG + "Starting webserver in '" + mode + "' mode." );

      localServer =
        new Monitor( "app/server.js"
                   , { max      : 3
                     , silent   : false
                     , args     : host ? [ "--connect", host ] : []
                     , killtree : true
                     }
                   );

      localServer.setMaxListeners( 0 );

      localServer.on( "error", function ( err ) {
        console.log( TAG + chalk.red( "[ ERROR ] " ) + err );
      });

      localServer.on( "start", function ( process, data ) {
        console.log( TAG + chalk.green( "[ START ] " ) + "Webserver started" );
      });

      localServer.on( "restart", function ( forever ) {
        console.log( TAG + chalk.cyan( "[ RESTART ] " )
                   + "Webserver is restarting"
                   );
      });

      localServer.on( "exit:code", function ( code ) {
        console.log( TAG + chalk.bgBlack( "[ EXIT ]" )
                   + ( code ? " Code " + code : "" )
                   );
      });

      localServer.on( "stdout", function ( data ) {
        console.log( TAG + chalk.gray( "[ STDOUT ] \n" ) + data + "\n" );
      });

      localServer.on( "stderr", function ( data ) {
        console.log( TAG + chalk.red( "[ STDERR ] \n" ) + data + "\n" );
      });

      localServer.start();
      break;

    case "remote":
      // TODO: Reenable true remote development
      break;
  }
});
