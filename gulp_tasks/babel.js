// BABEL
// =====
// Use gulp-babel to transpile our source into ES3, and set up a watcher.

"use strict";

var gulp       = require( "gulp" );
var changed    = require( "gulp-changed" );
var babel      = require( "gulp-babel" );
var sourcemaps = require( "gulp-sourcemaps" );

var chalk      = require( "chalk" );

var SRC  = [ "app/src/jsx/**/*.jsx", "app/src/jsx/**/*.js" ];
var DEST = "app/build/babel";

gulp.task( "babel"
         , function () {
  return gulp.src( SRC )
             .pipe( changed( DEST ) )
             .pipe( sourcemaps.init() )
             .pipe( babel() )
             .pipe( sourcemaps.write() )
             .pipe( gulp.dest( DEST ) );
});

var watcher = gulp.watch( SRC, [ "babel" ] );
watcher.on( "change", function ( event ) {
  console.log( chalk.bgYellow.black( "  BABEL  " ) + " "
             + event.path.split( "/" ).pop() + " was " + event.type
             );
});
