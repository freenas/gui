// BABEL
// =====
// Use gulp-babel to transpile our source into ES3, and set up a watcher.

"use strict";

var gulp       = require( "gulp" );
var babel      = require( "gulp-babel" );
var sourcemaps = require( "gulp-sourcemaps" );

var chalk      = require( "chalk" );

var paths = [ "app/src/jsx/**/*.jsx", "app/src/jsx/**/*.js" ];

gulp.task( "babel"
         , function () {
  return gulp.src( paths )
             .pipe( sourcemaps.init() )
             .pipe( babel() )
             .pipe( sourcemaps.write() )
             .pipe( gulp.dest( "app/build/js" ) );
});

var watcher = gulp.watch( paths, [ "babel" ] );
watcher.on( "change", function ( event ) {
  console.log( chalk.bgYellow( "Babel" ) + " " + event.path + " was "
             + event.type
             );
});
