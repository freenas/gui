// FONTS
// =====
// A simple copy task for fonts. This may later be expanded, but for the time
// being, it's perfectly adequate. It probably never needs a watcher.

"use strict";

var gulp    = require( "gulp" );
var flatten = require( "gulp-flatten" );
var chalk   = require( "chalk" );

var OS = "bower_components/lessfonts-open-sans/dist/fonts/OpenSans/**/*";
var FA = "bower_components/fontawesome/fonts/**/*";

gulp.task( "fonts", [ "openSans", "tempIconFont" ] );

gulp.task( "openSans"
         , [ "install-packages" ]
         , function () {
  return gulp.src( OS )
             .pipe( flatten() )
             .pipe( gulp.dest( "app/build/font" ) );
});

gulp.task( "tempIconFont"
         , [ "install-packages" ]
         , function () {
  return gulp.src( FA )
             .pipe( flatten() )
             .pipe( gulp.dest( "app/build/font" ) );
});
