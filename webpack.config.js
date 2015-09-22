// WEBPACK CONFIG
// ==============
// Configuration settings for Webpack

"use strict";

var webpack = require( "webpack" );
var ExtractTextPlugin = require( "extract-text-webpack-plugin" );

module.exports =
  { name: "browser"
  , context: __dirname + "/app"
  , cache: {}
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
    { extensions: [ "", ".js", ".jsx", ".css", ".less" ]
    }
  , node:
    { fs: "empty"
    }
  , module:
    { loaders:
      [ { test: /\.(js|jsx)$/
        , exclude: /node_modules/
        , loaders: [ "react-hot", "babel" ]
        }
      , { test: /\.less$/
          // Activate source maps via loader query
        , loader: ExtractTextPlugin.extract( "style"
                                           , "css?sourceMap"
                                           + "!less?sourceMap"
                                           )
        }
      , { test: /\.(eot|woff|woff2|ttf|svg|png|jpg)/
        , loader: "url-loader?limit=30000&name=[name]-[hash].[ext]"
        }
      ]
    }
  , devtool: "source-map"
  , plugins:
    [ new webpack.HotModuleReplacementPlugin()
    , new webpack.NoErrorsPlugin()
    , new ExtractTextPlugin( "extract.css"
                           , { allChunks: true
                             }
                           )
    , new webpack.DefinePlugin(
        { "process.env":
          { BROWSER: JSON.stringify( true )
          }
        }
      )
    ]
  };
