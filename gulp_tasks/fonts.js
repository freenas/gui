// FONTS
// =====
// A simple copy task for fonts. This may later be expanded, but for the time
// being, it's perfectly adequate. It probably never needs a watcher.

"use strict";

var gulp    = require( "gulp" );
var flatten = require( "gulp-flatten" );
var chalk   = require( "chalk" );

var fontawesome = "bower_components/fontawesome/fonts/**/*";
var lato = "app/src/type/lato/**/*";

gulp.task( "fonts", [ "lato", "tempIconFont" ] );

gulp.task( "lato"
         , function () {
  return gulp.src( lato )
             .pipe( flatten() )
             .pipe( gulp.dest( "app/build/font" ) );
});

gulp.task( "tempIconFont"
         , function () {
  return gulp.src( fontawesome )
             .pipe( flatten() )
             .pipe( gulp.dest( "app/build/font" ) );
});
