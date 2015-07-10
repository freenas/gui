// GULPFILE

var gulp       = require( "gulp" );
var babel      = require( "gulp-babel" );
var gutil      = require( "gulp-util" );
var install    = require( "gulp-install" );
var jscs       = require( "gulp-jscs" );
var less       = require( "gulp-less" );
var minify     = require( "gulp-minify-css" );
var sourcemaps = require( "gulp-sourcemaps" );
var uglify     = require( "gulp-uglify" );
var plumber    = require( "gulp-plumber" );
var watch      = require( "gulp-watch" );

var source     = require( "vinyl-source-stream" );
var buffer     = require( "vinyl-buffer" );

var _          = require( "lodash" );
var del        = require( "del" );
var watchify   = require( "watchify" );
var babelify   = require( "babelify" );
var browserify = require( "browserify" );

// JSCS error handler
var handleJscsError = function ( err ) {
  console.log( "Error: " + err.toString() );
  this.emit( "end" );
};

gulp.task( "default"
         , [ "check-environment"
           , "install-packages"
           , "build"
           ]
         );

gulp.task( "build", [ "clean", "babel", "browserify" ] );




gulp.task( "check-environment", function () {
});




gulp.task( "install-packages", function () {
  gulp.src( [ "./bower.json", "./package.json" ] )
      .pipe( install() );
});




gulp.task( "clean", function ( callback ) {
  del(
    [ "app/build/**/*" ]
    , callback
  );
});




gulp.task( "jscs", function ( callback ) {
  return gulp.src( [ "app/src/jsx/**/*.jsx", "app/src/jsx/**/*.js" ] )
             .pipe( jscs( ".jscsrc" ) )
             .on( "error", handleJscsError );
});




gulp.task( "babel"
         , [ "clean" ]
         , function () {
  return gulp.src( [ "app/src/jsx/**/*.jsx", "app/src/jsx/**/*.js" ] )
             .pipe( watch( [ "app/src/jsx/**/*.jsx", "app/src/jsx/**/*.js" ] ) )
             .pipe( plumber() )
             .pipe( sourcemaps.init() )
             .pipe( babel() )
             .pipe( sourcemaps.write() )
             .pipe( gulp.dest( "app/build/js" ) );
});




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
    .on( "error", gutil.log.bind( gutil, "Browserify Error: " ) )
    .pipe( source( "app.js" ) )
    .pipe( buffer() )
    .pipe( sourcemaps.init() )
    .pipe( sourcemaps.write( "./" ) )
    .pipe( gulp.dest( "app/build/" ) );
}

gulp.task( "browserify", [ "clean" ], bundle );
