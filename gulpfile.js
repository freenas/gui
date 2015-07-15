// GULPFILE
// ========
// Entry point for the live development environment. Automatically builds and
// transpiles the GUI's source code with inteligent watchers and pipelines.

"use strict";

var gulp        = require( "gulp" );
var runSequence = require( "run-sequence" );

// Load all independent tasks defined in the gulp_tasks directory, including
// those in subdirectories.
require( "require-dir" )( "./gulp_tasks/", { recurse: true } );

gulp.task( "default", function ( callback ) {
  runSequence( [ "clean", "install-packages" ]
             , [ "babel"
               , "browserify"
               , "libs"
               , "less"
               , "images"
               , "favicons"
               , "fonts"
               ]
             , "serve"
             , callback
             );
});
