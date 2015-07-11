// GULP TASK INDEX
// ===============
// Just a cute little task loader that helps break up the gulpfile, and shows
// explicitly which tasks are available.

"use strict";

var gulp = require( "gulp" );

module.exports = function ( tasks ) {
  tasks.forEach( function ( name ) {
    gulp.task( name, require( "./" + name ) );
  });

  return gulp;
};
