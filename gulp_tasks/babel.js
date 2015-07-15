// BABEL
// =====
// Use gulp-babel to transpile our source into ES3, and set up a watcher.

"use strict";

var gulp       = require( "gulp" );
var cache      = require( "gulp-cached" );
var remember   = require( "gulp-remember" );
var babel      = require( "gulp-babel" );
var sourcemaps = require( "gulp-sourcemaps" );

var chalk      = require( "chalk" );

var SRC  = [ "app/src/scripts/**/*.jsx", "app/src/scripts/**/*.js" ];
var DEST = "app/build/babel";

gulp.task( "babel"
         , function () {
  return gulp.src( SRC )
             .pipe( cache( "scripts" ) )
             .pipe( sourcemaps.init() )
             .pipe( babel() )
             .pipe( sourcemaps.write() )
             .pipe( remember( "scripts" ) )
             .pipe( gulp.dest( DEST ) );
});

var watcher = gulp.watch( SRC, [ "babel" ] );
watcher.on( "change", function ( event ) {
  console.log( chalk.bgYellow.black( "  BABEL  " ) + " "
             + event.path.split( "/" ).pop() + " was " + event.type
             );
});
