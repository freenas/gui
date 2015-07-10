// GULPFILE
// ========
// Entry point for the live development environment. Automatically builds and
// transpiles the GUI's source code with inteligent watchers and pipelines.

"use strict";

var gulp  = require( "gulp" );
var gutil = require( "gulp-util" );

// Load all independent tasks defined in the gulp_tasks directory, including
// those in subdirectories.
require( "require-dir" )( "./gulp_tasks/", { recurse: true } );

gulp.task( "default"
         , [ "clean"
           , "check-environment"
           , "install-packages"
           , "javascript"
           , "less"
           , "images"
           ]
         );

gulp.task( "javascript"
         , [ "clean"
           , "check-environment"
           , "install-packages"
           , "babel"
           , "browserify"
           ]
         );
