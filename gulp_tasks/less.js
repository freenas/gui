// LESS
// ====
// Watch and compile LESS into CSS, with sourcemaps.

"use strict";

var gulp       = require( "gulp" );
var less       = require( "gulp-less" );
var minify     = require( "gulp-minify-css" );
var sourcemaps = require( "gulp-sourcemaps" );
var rename     = require( "gulp-rename" );

var chalk = require( "chalk" );

gulp.task( "less"
         , function () {
  return gulp.src( "app/src/styles/core.less" )
             .pipe( sourcemaps.init() )
             .pipe( less() )
             .pipe( minify() )
             .pipe( sourcemaps.write() )
             .pipe( rename( "main.css" ) )
             .pipe( gulp.dest( "app/build/css" ) );
});

var watcher = gulp.watch( "app/src/styles/**/*", [ "less" ] );
watcher.on( "change", function ( event ) {
  console.log( chalk.bgBlue.white( "  LESS  " ) + " "
             + event.path.split( "/" ).pop() + " was " + event.type
             );
});
