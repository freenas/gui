// GULPFILE
// ========
// Entry point for the live development environment. Automatically builds and
// transpiles the GUI's source code with inteligent watchers and pipelines.

"use strict";

var gulp        = require( "gulp" );
var path        = require( "path" );
var runSequence = require( "run-sequence" );

var env = require( "gulp-env" );
var argv = require( "yargs" ).argv;

var prettyPrint = require( "./gulp_common/prettyPrint" );

// Load all independent tasks defined in the gulp_tasks directory, including
// those in subdirectories.
require( "require-dir" )( "./gulp_tasks/", { recurse: true } );

gulp.task( "default", function ( callback ) {
  process.env.NODE_ENV = process.env.NODE_ENV || "development";

  runSequence( [ "clean", "install-packages" ]
             , "serve"
             , "webpack-dev-server"
             , callback
             );
});

gulp.task( "deploy", function ( callback ) {
  if ( !argv.output ) {
    throw new Error( "An --output was not set!" );
    callback();
  }

  process.env.NODE_ENV = "production";

  prettyPrint.tag( "bgBlue"
                 , "DEPLOY"
                 , "Creating deployment in "
                 + path.join( __dirname, argv.output )
                 );
  runSequence( [ "clean", "install-packages" ]
             , [ "package-src"
               , "package-server"
               , "package-build"
               ]
             , "package-node-modules"
             , callback
             );
});
