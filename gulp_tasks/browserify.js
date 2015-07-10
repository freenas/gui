// BROWSERIFY
// ==========
// Create user-facing app bundle, using babelify transform to create ES3 code.
// Uniquely use watchify to recreate the bundle, since its caching mechanism
// is far better than using native watch.

"use strict";

var gulp       = require( "gulp" );
var gutil      = require( "gulp-util" );
var sourcemaps = require( "gulp-sourcemaps" );

var source = require( "vinyl-source-stream" );
var buffer = require( "vinyl-buffer" );

var _          = require( "lodash" );
var watchify   = require( "watchify" );
var babelify   = require( "babelify" );
var browserify = require( "browserify" );

var customOptions =
  { entries    : [ "./app/src/jsx/browser.jsx" ]
  , extensions : [ ".js", ".jsx" ]
  , debug      : true
  };

var options = _.assign( {}, watchify.args, customOptions );
var b = watchify( browserify( options ) );

b.on( "update", bundle );
b.on( "log", gutil.log );
b.transform( babelify );

function bundle () {
  return b.bundle()
    .on( "error", gutil.log.bind( gutil, "Browserify Error" ) )
    .pipe( source( "app.js" ) )
    .pipe( buffer() )
    .pipe( sourcemaps.init() )
    .pipe( sourcemaps.write( "./" ) )
    .pipe( gulp.dest( "app/build/" ) );
}

gulp.task( "browserify", bundle );
