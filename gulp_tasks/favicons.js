// FAVICONS
// ========
// Favicons task. No watcher necessary.

"use strict";

var gulp = require( "gulp" );

gulp.task( "favicons"
         , function () {
  return gulp.src( "app/src/favicons/**/*" )
             .pipe( gulp.dest( "app/build" ) );
});
