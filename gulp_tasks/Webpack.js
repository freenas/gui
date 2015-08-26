// WEBPACK
// =======

"use strict";

var gulp = require( "gulp" );
var gutil = require( "gulp-util" );
var webpack = require( "webpack" );
var WebpackDevServer = require( "webpack-dev-server" );

var prettyPrint = require( "../gulp_common/prettyPrint" );

var config = require( "../webpack.config" );

var DEV_PORT = "9999";

function handleWebpackOutput ( callback, error, stats ) {
  if ( error ) {
    throw new gutil.PluginError( "webpack", error );
  }
  prettyPrint.tag( "bgYellow", "WEBPACK", stats.toString({
      // output options
  }) );

  callback();
}

function handleDevServerOutput ( callback, error ) {
  if ( error ) {
    throw new gutil.PluginError( "webpack-dev-server", error );
  }

  // Server listening
  prettyPrint.tag( "bgMagenta"
                 , "WEBPACK DEV SERVER"
                 , "Starting Webpack dev server"
                 );

  console.log(
"\n\n" +
"The FreeNAS X GUI builder is now using Webpack's Hot Module Replacement\n" +
"in conjunction with the Webpack development server. This means that aside\n" +
"from the initial build, the on-disk version of the JS bundle will not be\n" +
"recreated." +
"\n\n" +
"For more on HMR, please refer to:\n" +
"https://webpack.github.io/docs/hot-module-replacement-with-webpack.html" +
"\n\n" +
"This address is hosting the Webpack dev server, and will feature\n" +
"incremental rebuilds of the app:" +
"\n\n"
  );
  prettyPrint.hostname( "http://localhost:" + DEV_PORT, "up" );

  // Keep the server alive, even through an error
  callback();
}

gulp.task( "webpack", function ( callback ) {

  webpack( config, handleWebpackOutput.bind( this, callback ) );
});

gulp.task( "webpack-dev-server", function ( callback ) {
  var compiler = webpack( config );

  new WebpackDevServer( compiler
                      , { hot: true
                        , noInfo: true
                        , colors: true
                        , historyApiFallback: true
                        , proxy:
                          { "*": "http://localhost:8888" }
                        }
                      )
    .listen( DEV_PORT, "localhost", handleDevServerOutput.bind( this, callback ) );
});
