// WEBPACK CONFIGURATION CREATOR
// =============================
// Configuration settings for Webpack. Note that this file exports a constructor
// rather than a webpack CLI compatible configuration.

// TODO: Everything in this file sucks and was done under incredible time
// pressure. If you want it to be better, don't complain to me, just make it
// better and submit your PR. thx fam.
// <3 Corey

"use strict";

var _ = require( "lodash" );
var path = require( "path" );
var webpack = require( "webpack" );
var ExtractTextPlugin = require( "extract-text-webpack-plugin" );

var prettyPrint = require( "./prettyPrint" );

var COMMON_CONFIG =
  { name: "browser"
  , context: path.resolve( __dirname + "./../app" )
  , cache: {}
  , output:
    { path: path.resolve( __dirname + "./../app/build" )
    , filename: "app.js"
    }
  , resolve: { extensions: [ "", ".js", ".jsx", ".css", ".less" ] }
  , node: { fs: "empty" }
  };

var PRODUCTION_CONFIG =
  { entry:
    [ "./scripts/browser.jsx"
    ]
  , module:
    { loaders:
      [ { test: /\.(js|jsx)$/
        , exclude: /node_modules/
        , loaders: [ "babel" ]
        }
      , { test: /\.less$/
        , loader: ExtractTextPlugin.extract( "css!less" )
        }
      , { test: /\.(eot|woff|woff2|ttf|svg|png|jpg)/
        , loader: "url?limit=30000&name=[name]-[hash].[ext]"
        }
      ]
    }
  , plugins:
    [ new webpack.NoErrorsPlugin()
    , new ExtractTextPlugin( "extract.css", { allChunks: true } )
    , new webpack.DefinePlugin(
        { "process.env":
          { BROWSER: JSON.stringify( true )
          }
        }
      )
    ]
  };

var DEVELOPMENT_CONFIG =
  { entry:
    [ "webpack-dev-server/client?http://0.0.0.0:9999"
    , "webpack/hot/only-dev-server"
    , "./scripts/browser.jsx"
    ]
  , module:
    { loaders:
      [ { test: /\.(js|jsx)$/
        , exclude: /node_modules/
        , loaders: [ "react-hot", "babel" ]
        }
      , { test: /\.less$/
          // Activate source maps via loader query
        , loader: ExtractTextPlugin.extract( "css!less" )
        }
      , { test: /\.(eot|woff|woff2|ttf|svg|png|jpg)/
        , loader: "file?name=[name]-[hash].[ext]"
        }
      ]
    }
  , devtool: "#eval-source-map"
  , plugins:
    [ new webpack.HotModuleReplacementPlugin()
    , new webpack.NoErrorsPlugin()
    , new ExtractTextPlugin( "extract.css", { allChunks: true } )
    , new webpack.DefinePlugin(
        { "process.env":
          { BROWSER: JSON.stringify( true )
          }
        }
      )
    ]
  };

module.exports = function Configuration ( envOverride ) {
  var ENV = process.env.NODE_ENV || envOverride;
  var otherConfig;

  if ( ENV === "production" ) {
    otherConfig = PRODUCTION_CONFIG;

    prettyPrint.tag( "bgYellow"
                   , "WEBPACK"
                   , "Starting PRODUCTION Webpack build"
                   );
  } else {
    if ( !ENV ) {
      prettyPrint.tag( "bgYellow"
                     , "WEBPACK"
                     , "WARNING: NODE_ENV was not set. Assuming 'development'."
                     );
    } else if ( ENV !== "development" ) {
      prettyPrint.tag( "bgYellow"
                     , "WEBPACK"
                     , "WARNING: NODE_ENV was set to " + ENV + ". It should "
                     + "be either 'development' or 'production'"
                     );
    }
    otherConfig = DEVELOPMENT_CONFIG;

    prettyPrint.tag( "bgYellow"
                   , "WEBPACK"
                   , "Starting DEVELOPMENT Webpack build"
                   );
  }

  return _.assign( COMMON_CONFIG, otherConfig );
};
