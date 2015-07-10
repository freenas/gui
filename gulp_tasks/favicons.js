// FAVICONS
// ========
// Favicons task. No watcher necessary.

"use strict";

var gulp       = require( "gulp" );

gulp.task( "favicons"
         , [ "clean" ]
         , function () {
  return gulp.src( "app/src/favicons/**/*" )
             .pipe( gulp.dest( "app/build" ) );
});
