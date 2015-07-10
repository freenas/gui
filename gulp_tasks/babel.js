// BABEL
// =====
// Use gulp-babel to transpile our source into ES3, and set up a watcher.

"use strict";

var gulp       = require( "gulp" );
var babel      = require( "gulp-babel" );
var plumber    = require( "gulp-plumber" );
var sourcemaps = require( "gulp-sourcemaps" );
var watch      = require( "gulp-watch" );

gulp.task( "babel"
         , [ "clean" ]
         , function () {
  return gulp.src( [ "app/src/jsx/**/*.jsx", "app/src/jsx/**/*.js" ] )
             .pipe( watch( [ "app/src/jsx/**/*.jsx", "app/src/jsx/**/*.js" ] ) )
             .pipe( plumber() )
             .pipe( sourcemaps.init() )
             .pipe( babel() )
             .pipe( sourcemaps.write() )
             .pipe( gulp.dest( "app/build/js" ) );
});
