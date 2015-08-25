// WEBPACK
// =======

"use strict";

var gulp = require( "gulp" );
var gutil = require( "gulp-util" );
var webpack = require( "webpack" );
var WebpackDevServer = require( "webpack-dev-server" );

var config = require( "../webpack.config" );

function handleWebpackError ( callback, error, stats ) {
  if ( error ) {
    throw new gutil.PluginError( "webpack", error );
  }
  gutil.log( "[webpack]", stats.toString({
      // output options
  }) );

  callback();
}

function handleDevServerError ( callback, error ) {
  if ( error ) {
    throw new gutil.PluginError("webpack-dev-server", error );
  }

  // Server listening
  gutil.log("[webpack-dev-server]", "http://localhost:9999/webpack-dev-server/index.html");

  // Keep the server alive, even through an error
  callback();
}

gulp.task( "webpack", function ( callback ) {
  webpack( config, handleWebpackError.bind( this, callback ) );
});

gulp.task( "webpack-dev-server", function ( callback ) {
  var compiler = webpack( config );

  new WebpackDevServer( compiler
                      , { hot: true
                        , historyApiFallback: true
                        , proxy:
                          { "*": "http://localhost:8888" }
                        }
                      )
    .listen( 9999, "localhost", handleDevServerError.bind( this, callback ) );
});
