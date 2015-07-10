// LESS
// ====
// Watch and compile LESS into CSS, with sourcemaps.

"use strict";

var gulp       = require( "gulp" );
var less       = require( "gulp-less" );
var minify     = require( "gulp-minify-css" );
var plumber    = require( "gulp-plumber" );
var sourcemaps = require( "gulp-sourcemaps" );
var watch      = require( "gulp-watch" );
var rename     = require( "gulp-rename" );

gulp.task( "less"
         , [ "clean", "check-environment", "install-packages" ]
         , function () {
  return gulp.src( "app/src/styles/core.less" )
             .pipe( watch( "app/src/styles/**/*" ) )
             .pipe( plumber() )
             .pipe( sourcemaps.init() )
             .pipe( less() )
             .pipe( minify() )
             .pipe( sourcemaps.write() )
             .pipe( rename( "main.css" ) )
             .pipe( gulp.dest( "app/build/css" ) );
});
