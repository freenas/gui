// IMAGES
// ======
// Copy and process images, with a watch task.

"use strict";

var gulp       = require( "gulp" );
var plumber    = require( "gulp-plumber" );
var watch      = require( "gulp-watch" );

gulp.task( "images"
         , [ "clean" ]
         , function () {
  return gulp.src( "app/src/images/**/*" )
             .pipe( watch( "app/src/images/**/*" ) )
             // TODO: Process images appropriately
             .pipe( gulp.dest( "app/build/img" ) );
});
