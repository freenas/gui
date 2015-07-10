// CLEAN
// =====
// Remove build artifacts and working files.

"use strict";

var gulp = require( "gulp" );
var del  = require( "del" );

gulp.task( "clean", function ( callback ) {
  del(
    [ "app/build/**/*" ]
    , callback
  );
});
