// LIBS
// ====
// Simple concat task for our libs, using the already minified source provided
// by the Bower components.

"use strict";

var gulp   = require( "gulp" );
var concat = require( "gulp-concat" );

gulp.task( "libs"
         , function () {
  return gulp.src( [ "bower_components/velocity/velocity.min.js"
                   , "bower_components/velocity/velocity.ui.min.js"
                   , "bower_components/d3/d3.min.js"
                   , "node_modules/babel/browser-pollyfill.min.js"
                   ]
                 )
              .pipe( concat( "libs.js" ) )
              .pipe( gulp.dest( "app/build" ) );
});
