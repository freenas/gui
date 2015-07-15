// BROWSER SYNC
// ============

"use strict";

var gulp = require("gulp");
var bs = require("browser-sync");

gulp.task( "browser-sync", function () {
  bs.init({ proxy: "localhost:8888" });
});

