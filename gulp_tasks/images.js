// IMAGES
// ======

// WARNING: This is a temporary workaround until someone has time to sit down
// and write all the correct cache-busting and shimming that will make this work
// with Webpack.

"use strict";

var gulp = require( "gulp" );

var chalk = require( "chalk" );

gulp.task( "images"
         , function () {
  return gulp.src( "app/assets/images/**/*" )
             // TODO: Process images appropriately
             .pipe( gulp.dest( "app/build/images" ) );
});
