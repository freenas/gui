// JSCS
// ====
// Use JSCS to evaluate code's adherence to the style guide.

"use strict";

var gulp = require( "gulp" );
var jscs = require( "gulp-jscs" );

// JSCS error handler
var handleJscsError = function ( err ) {
  console.log( "Error: " + err.toString() );
  this.emit( "end" );
};

// TODO: Hard fail if code doesn't match style guide.
gulp.task( "jscs", function ( callback ) {
  return gulp.src( [ "app/src/jsx/**/*.jsx", "app/src/jsx/**/*.js" ] )
             .pipe( jscs( ".jscsrc" ) )
             .on( "error", handleJscsError );
});
