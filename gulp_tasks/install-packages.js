// INSTALL PACKAGES
// =================
// Startup shim that automatically installs bower components and npm modules.

"use strict";

var gulp  = require( "gulp" );
var shell = require( "gulp-shell" );
var argv  = require( "yargs" ).argv;

// TODO: Install packages whenever bower.json or package.json change (from git
// pull or other non-user initiated action)
gulp.task( "install-packages", shell.task( [ "npm install" ] ) );

gulp.task( "install-production", shell.task( [ "npm install --production" ] ) );

gulp.task( "prune-production", function ( callback ) {
  if ( argv[ "no-prune" ] ) {
    callback();
  } else {
    shell.task( [ "npm prune --production" ] );
    callback();
  }
});
