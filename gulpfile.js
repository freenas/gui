// GULPFILE
// ========
// Entry point for the live development environment. Automatically builds and
// transpiles the GUI's source code with inteligent watchers and pipelines.

"use strict";

var gulp    = require( "gulp" );
var gutil   = require( "gulp-util" );
var Monitor = require( "forever-monitor" ).Monitor;
var chalk   = require( "chalk" );

// Load all independent tasks defined in the gulp_tasks directory, including
// those in subdirectories.
require( "require-dir" )( "./gulp_tasks/", { recurse: true } );

var serverTag = function ( mode ) {
  return chalk.bgWhite.black( "  WEBSERVER  " ) + " ";
};

gulp.task( "default", function () {
  gulp.run( "init", "build", "serve" );
});


// LDE INIT TASKS
gulp.task( "init", function ( callback ) {
  gulp.run( "clean"
          , "check-environment"
          , "install-packages"
          );
  callback();
});


// ASYNCHRONOUS BUILD TASKS
gulp.task( "build"
         , [ "init"
           , "babel"
           , "browserify"
           , "libs"
           , "less"
           , "images"
           , "favicons"
           , "fonts"
           ]
         );

gulp.task( "serve", [ "init", "build" ], function () {
  var mode = "local"; // FIXME: Hardcoded for now
  var tag = serverTag( mode );

  switch ( mode ) {
    case "local":
    case "connect":
      // TODO: Enable the passing of an IP/hostname to server.

      console.log( tag + "Starting webserver in '" + mode + "' mode." );

      var localServer =
        new Monitor( "app/server.js"
                   , { max    : 3
                     , silent : true
                     , args   : []
                     }
                   );

      localServer.on( "error", function ( err ) {
        console.log( tag + chalk.red( "[ ERROR ] " ) + err );
      });

      localServer.on( "start", function ( process, data ) {
        console.log( tag + chalk.green( "[ START ] " ) + "Webserver started" );
      });

      localServer.on( "stop", function ( process ) {
        console.log( tag + chalk.red( "[ STOP ] " ) );
      });

      localServer.on( "watch:restart", function ( info ) {
        console.log( tag + chalk.blue( "[ WATCH ] " )
                   + "Detected change to " + info.file
                   );
      });

      localServer.on( "restart", function ( forever ) {
        console.log( tag + chalk.cyan( "[ RESTART ] " )
                   + "Webserver is restarting"
                   );
      });

      localServer.on( "exit:code", function ( code ) {
        console.log( tag + chalk.bgBlack( "[ EXIT ]" ) + " Code " + code );
      });

      localServer.on( "stdout", function ( data ) {
        console.log( tag + chalk.gray( "[ STDOUT ] \n" ) + data + "\n" );
      });

      localServer.on( "stderr", function ( data ) {
        console.log( tag + chalk.red( "[ STDERR ] \n" ) + data + "\n" );
      });

      localServer.start();

      break;

    case "remote":
      // TODO: Reenable true remote development
      break;
  }

});
