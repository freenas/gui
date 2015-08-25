// WEBPACK CONFIG
// ==============
// Configuration settings for Webpack

"use strict";

var webpack = require( "webpack" );

module.exports =
  { name: "browser"
  , context: __dirname + "/app"
  , entry:
    // WebpackDevServer host and port
    [ "webpack-dev-server/client?http://0.0.0.0:9999"
    , "webpack/hot/only-dev-server"
    , "./src/scripts/browser.jsx"
    ]
  , output:
    { path: __dirname + "/app/build"
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
        , loaders: [ "react-hot", "babel-loader" ]
        }
      ]
    }
  , devtool: "cheap-eval-source-map"
  , plugins:
    [ new webpack.HotModuleReplacementPlugin()
    , new webpack.NoErrorsPlugin()
    ]
  };
