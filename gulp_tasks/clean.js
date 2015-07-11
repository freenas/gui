// CLEAN
// =====
// Remove build artifacts and working files.

"use strict";

var gulp  = require( "gulp" );
var del   = require( "del" );
var chalk = require( "chalk" );

gulp.task( "clean", function ( callback ) {

  console.log( chalk.bgRed.white( "  CLEAN  " ) + " Deleted "
             + del.sync( [ "app/build/**/*" ] ).length
             + " files and folders"
             );
  callback();
});
