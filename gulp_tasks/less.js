// LESS
// ====
// Watch and compile LESS into CSS, with sourcemaps.

// Inspired by:
// https://github.com/maxomedia/mxm-gulp/tree/support/incremental-less

"use strict";

var gulp       = require( "gulp" );
var debug      = require( "gulp-debug" );
var filter     = require( "gulp-filter" );
var concat     = require( "gulp-concat" );
var plumber    = require( "gulp-plumber" );
var cache      = require( "gulp-cached" );
var remember   = require( "gulp-remember" );
var sourcemaps = require( "gulp-sourcemaps" );
var progeny    = require( "gulp-progeny" );
var less       = require( "gulp-less" );
var bs         = require( "browser-sync" );

var chalk = require( "chalk" );

var TAG = chalk.bgBlue.white( "  LESS  " ) + " ";

gulp.task( "less"
         , function () {
  return gulp
    .src( "app/src/styles/**.*less" )
    // Handle errors without crashing stream
    .pipe( plumber(
      { errorHandler: function ( error ) {
          console.log( TAG + error )
          this.emit( "end" )
        }
      }
    ))
    // Add new and changed files to the cache
    .pipe( cache( "styles" ) )
    // This will build a dependency tree based on any @import
    // statements found by the given REGEX. If you change one file,
    // we'll rebuild any other files that reference it.
    .pipe( progeny(
      { regexp: /^\s*@import\s*(?:\(\w+\)\s*)?['"]([^'"]+)['"]/ }
    ))
    // Output the name of each LESS file that is being rebuilt
    .pipe( debug( { title: TAG } ) )
    .pipe( sourcemaps.init() )
    .pipe( less() )
    .pipe( remember( "styles" ) )
    .pipe( concat( "main.css" ) )
    .pipe( sourcemaps.write() )
    .pipe( gulp.dest( "app/build/css" ) )
    .pipe( bs.reload({ stream: true }) );
});

var watcher = gulp.watch( "app/src/styles/**/*.less", [ "less" ] );
watcher.on( "change", function ( event ) {
  console.log( TAG + event.path.split( "/" ).pop() + " was " + event.type );
});
