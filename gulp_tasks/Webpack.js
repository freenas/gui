// WEBPACK
// =======

"use strict";

var gulp = require( "gulp" );
var gutil = require( "gulp-util" );
var webpack = require( "webpack" );
var WebpackDevServer = require( "webpack-dev-server" );

gulp.task( "webpack", function ( callback ) {
  webpack(
    { name: "browser"
    , entry: "./app/src/scripts/browser.jsx"
    , output:
      { path: "./app/build"
      , filename: "app.js"
      }
    , resolve:
      { extensions: [ "", ".js", ".jsx" ]
      }
    , node:
      { fs: "empty"
      }
    , module:
      { loaders:
        [ { test: /(\.js$)|(\.jsx$)/
          , exclude: /node_modules/
          , loader: "babel-loader"
          }
        ]
      }
    , devtool: "cheap-eval-source-map"
    }
    , function ( err, stats ) {
        if ( err ) { throw new gutil.PluginError( "webpack", err ); }
        gutil.log( "[webpack]", stats.toString({
            // output options
        }) );
        callback();
      }
  );
});
