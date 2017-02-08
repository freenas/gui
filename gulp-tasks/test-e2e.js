var browserSync = require('browser-sync').create(),
    nightwatch = require('gulp-nightwatch'),
    selenium = require('selenium-standalone');

module.exports = function(gulp) {
    return function() {
        browserSync.init({
            server: './',
            open: false
        });
        var seleniumConfig = {
            // check for more recent versions of selenium here:
            // https://selenium-release.storage.googleapis.com/index.html
            version: '3.0.1',
            baseURL: 'https://selenium-release.storage.googleapis.com',
            drivers: {
                chrome: {
                    // check for more recent versions of chrome driver here:
                    // https://chromedriver.storage.googleapis.com/index.html
                    version: '2.27',
                    arch: process.arch,
                    baseURL: 'https://chromedriver.storage.googleapis.com'
                }
            }
        };
        selenium.install(seleniumConfig, function() {
            selenium.start(seleniumConfig, function(err, child) {
                return gulp.src('')
                    .pipe(nightwatch({
                        configFile: 'nightwatch.json'
                    }))
                    .on('end', function() {
                        setTimeout(function() {
                            child.kill();
                            browserSync.exit();
                        }, 500);
                    });
            });
        });
    }
};
