// IMAGES
// ======
// Copy and process images, with a watch task.

"use strict";

var gulp = require( "gulp" );

var chalk = require( "chalk" );

gulp.task( "images"
         , [ "clean" ]
         , function () {
  return gulp.src( "app/src/images/**/*" )
             // TODO: Process images appropriately
             .pipe( gulp.dest( "app/build/img" ) );
});

var watcher = gulp.watch( "app/src/images/**/*", [ "images" ] );
watcher.on( "change", function ( event ) {
  console.log( chalk.green( "Images: " ) + event.path + " was " + event.type );
});
