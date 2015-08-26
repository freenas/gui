// CLEAN
// =====
// Remove build artifacts and working files.

"use strict";

var gulp = require( "gulp" );
var del = require( "del" );

var prettyPrint = require( "../gulp_common/prettyPrint" );

gulp.task( "clean", function ( callback ) {

  prettyPrint.tag( "bgRed", "CLEAN", "Cleaning previous builds" );

  del( [ "app/build" ], callback );
});
