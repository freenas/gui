// INSTALL PACKAGES
// =================
// Startup shim that automatically installs bower components and npm modules.

"use strict";

var gulp    = require( "gulp" );
var install = require( "gulp-install" );

// TODO: Install packages whenever bower.json or package.json change (from git
// pull or other non-user initiated action)
gulp.task( "install-packages", function () {
  return gulp.src( [ "./package.json" ] )
             .pipe( install() );
});
