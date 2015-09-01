// MACH SERVER
// ES5

"use strict";

require( "babel/register" );

// Delete BROWSER variable ( in case it exists! ) to make sure that any static
// resource requires are not triggered here when rendering.
delete process.env.BROWSER;

var fs   = require( "fs" );
var path = require( "path" );
var mach = require( "mach" );
var when = require( "when" );
var argv = require( "yargs" ).argv;

var React  = require( "react" );
var Router = require( "react-router" );

var routes = require( __dirname + "/src/scripts/routes" );

// Content
var appBundle  = fs.readFileSync( __dirname + "/build/app.js" );

var app = mach.stack();

function isDevMode () {
  return Boolean( argv.connect || argv.simulation );
}

// Mach server helpers
function renderApp ( path ) {
  return new when.Promise( function ( resolve, reject ) {
    Router.run( routes, path, function ( Handler ) {
      var pageHTML = React.renderToString( React.createElement( Handler ) );

      if ( pageHTML ) {
        resolve( "<!DOCTYPE html>" + pageHTML );
      } else {
        reject( "Handler for " + path + " did not return any HTML when "
              + "rendered to string"
              );
      }
    });
  });
}

function cors ( app ) {
  return function ( connection ) {
    return connection.call( app ).then( function () {
      connection.response.setHeader( "Access-Control-Allow-Origin", "*" );
    });
  };
}

// Mach server config
// DEVELOPMENT ENVIRONMENT
if ( isDevMode() ) {
  app.use( cors );
} else {
  app.use( mach.gzip );
}

app.use( mach.favicon );
app.use( mach.file, { root: path.join( __dirname, "build" ) } );

// Routes
app.get( "/js/app.js"
       , function ( request ) {
           return appBundle;
         }
       );

app.get( "/js/data-window-props.js"
       , function ( request ) {
           if ( argv["connect"] ) {
             return ( "window.__DEVELOPMENT_CONNECTION__ = "
                    + JSON.stringify( argv["connect"] )
                    );
           } else if ( argv["simulation"] ) {
             return "window.__DEVELOPMENT_CONNECTION__ = \"SIMULATION_MODE\"";
           }
         }
       );

app.get( "*"
       , function ( request ) {
           return renderApp( request.path );
         }
       );

// Start Mach server
mach.serve( app, 8888 );
