// BROWSER SYNC
// ============

"use strict";

var gulp = require("gulp");
var bs = require("browser-sync");

gulp.task( "browser-sync", function () {
  bs.init(
    { proxy: "localhost:8888"
    , reloadDelay: 1500
    , files: [ "app/build/img/**/*"
             , "app/build/font/**/*"
             ]
    }
  );
});

