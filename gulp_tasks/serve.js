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

var prettyPrint = require( "../gulp_common/prettyPrint" );

var APP_TAG = "WEBSERVER";
var SIM_TAG = "SIMULATOR";

var ERROR_TAG = chalk.red( "[ ERROR ] " );
var START_TAG = chalk.green( "[ START ] " );
var RESTART_TAG = chalk.cyan( "[ RESTART ] " );
var EXIT_TAG = chalk.bgBlack( "[ EXIT ]" );
var STDOUT_TAG = chalk.gray( "[ STDOUT ] \n" );
var STDERR_TAG = chalk.red( "[ STDERR ] \n" );

var appMonitorArgs = [];
var simMonitorArgs = [];

var localServer;
var simulator;

function buildChangeHandler ( vinyl ) {
  if ( localServer && localServer.restart ) {
    prettyPrint.tag( "bgWhite"
                   , APP_TAG
                   , chalk.blue( "[ WATCH ] " )
                   + "Issuing app restart command"
                   );
    localServer.restart();
  }
}

function simChangeHandler ( vinyl ) {
  if ( simulator && simulator.restart ) {
    prettyPrint.tag( "bgGreen"
                   , SIM_TAG
                   , chalk.blue( "[ WATCH ] " )
               + "Issuing simulator restart command"
               );
    simulator.restart();
  }
}

function startFreeNASApp ( mode ) {
  prettyPrint.tag( "bgWhite"
                 , APP_TAG
                 , "Starting webserver in '" + mode + "' mode."
                 );

  localServer =
    new Monitor( "app/server.js"
               , { silent   : true
                 , args     : appMonitorArgs
                 , killtree : true
                 }
               );

  localServer.setMaxListeners( 0 );

  localServer.on( "error", function ( err ) {
    prettyPrint.tag( "bgWhite"
                   , APP_TAG
                   , ERROR_TAG + err
                   );
  });

  localServer.on( "start", function ( process, data ) {
    prettyPrint.tag( "bgWhite"
                   , APP_TAG
                   , START_TAG + "Webserver started"
                   );
  });

  localServer.on( "restart", function ( forever ) {
    prettyPrint.tag( "bgWhite"
                   , APP_TAG
                   , RESTART_TAG + "Webserver is restarting"
                   );
  });

  localServer.on( "exit:code", function ( code ) {
    prettyPrint.tag( "bgWhite"
                   , APP_TAG
                   , EXIT_TAG
                   + code
                   ? " Code " + code
                   : ""
                   );
  });

  localServer.on( "stdout", function ( data ) {
    prettyPrint.tag( "bgWhite"
                   , APP_TAG
                   , STDOUT_TAG + data + "\n"
                   );
  });

  localServer.on( "stderr", function ( data ) {
    prettyPrint.tag( "bgWhite"
                   , APP_TAG
                   , STDERR_TAG + data + "\n"
                   );
  });

  localServer.start();
}

function startSimulator () {
  prettyPrint.tag( "bgGreen"
                 , SIM_TAG
                 , "Starting simulator instance"
                 );
  simulator =
    new Monitor( "simulator/simulator.js"
               , { silent   : true
                 , args     : simMonitorArgs
                 , killtree : true
                 }
               );

  simulator.setMaxListeners( 0 );

  simulator.on( "error", function ( err ) {
    prettyPrint.tag( "bgGreen"
                   , SIM_TAG
                   , ERROR_TAG + err
                   );
  });

  simulator.on( "start", function ( process, data ) {
    prettyPrint.tag( "bgGreen"
                   , SIM_TAG
                   , START_TAG + "Simulator started successfully" );
  });

  simulator.on( "restart", function ( forever ) {
    prettyPrint.tag( "bgGreen"
                   , SIM_TAG
                   , RESTART_TAG + "Simulator was restarted"
                   );
  });

  simulator.on( "exit:code", function ( code ) {
    prettyPrint.tag( "bgGreen"
                   , SIM_TAG
                   , EXIT_TAG
               + ( code
                 ? " Code " + code
                 : ""
                 )
               );
  });

  simulator.on( "stdout", function ( data ) {
    prettyPrint.tag( "bgGreen"
                   , SIM_TAG
                   , STDOUT_TAG + data + "\n"
                   );
  });

  simulator.on( "stderr", function ( data ) {
    prettyPrint.tag( "bgGreen"
                   , SIM_TAG
                   , STDERR_TAG + data + "\n"
                   );
  });

  simulator.start();

}

gulp.task( "serve"
         , [ "webpack" ]
         , function () {
  var mode;
  var host;

  watch( [ "app/build/app.js"
         , "app/server.js"
         ]
       , _.debounce( buildChangeHandler, 3000 ) );

  watch( [ "simulator/simulator.js" ]
       , _.debounce( simChangeHandler, 3000 ) );

  if ( argv["connect"] ) {
    mode = "connect";
    host = argv["connect"];
  } else {
    mode = "simulation";
  }

  if ( mode === "remote" ) {
    // TODO: True remote mode.
  } else {
    if ( host ) {
      appMonitorArgs.push( "--connect", host );
    }
    if ( mode === "simulation" ) {
      appMonitorArgs.push( "--simulation" );
      startSimulator();
    }

    startFreeNASApp( mode );
  }
});
