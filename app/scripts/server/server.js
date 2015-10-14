// FREENAS X GUI WEBSERVER
// =======================

"use strict";

// Delete BROWSER variable to prevent Webpack static asset requires from
// attempting to load on the server
delete process.env.BROWSER;

import fs from "fs";
import path from "path";
import mach from "mach";
import { argv } from "yargs";

import React from "react";
import { renderToString } from "react-dom/server";
import { match, RoutingContext } from "react-router";

import routes from "./../src/scripts/routes";

// Content
const BUNDLE = fs.readFileSync( path.normalize( __dirname + "./../build/app.js" ) );

var app = mach.stack();

function isDevMode () {
  return Boolean( argv.connect || argv.simulation );
}

// Mach server helpers
function renderApp ( path ) {
  return new Promise( function ( resolve, reject ) {
    match( { routes, location: path }, ( error, redirectLocation, renderProps ) => {
      if ( error ) {
        reject( new Error( error.message ) );
      } else if ( redirectLocation ) {
        resolve( redirectLocation.pathname + redirectLocation.search );
      } else if ( renderProps ) {
        resolve( renderToString( <RoutingContext { ...renderProps } /> ) );
      } else {
        reject( new Error( "Route not found" ) );
      }
    });
  });
}

function cors ( app ) {
  return ( connection ) => {
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
app.use( mach.file, { root: path.normalize( __dirname + "./../build/" ) } );

// Routes
app.get( "/js/app.js", ( request ) => { return BUNDLE; } );

app.get( "/js/data-window-props.js", ( request ) => {
  if ( argv.connect ) {
    return ( "window.__DEVELOPMENT_CONNECTION__ = "
           + JSON.stringify( argv.connect )
           );
  } else if ( argv.simulation ) {
    return "window.__DEVELOPMENT_CONNECTION__ = \"SIMULATION_MODE\"";
  }
});

app.get( "*", ( request ) => { return renderApp( request.path ); } );

// Start Mach server
mach.serve( app, 8888 );
