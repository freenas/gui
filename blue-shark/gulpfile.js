var path                    = require('path');
    gulp                    = require('gulp'),
    postcss                 = require('gulp-postcss'),
    header                  = require('gulp-header'),
    rename                  = require('gulp-rename'),
    newer                   = require('gulp-newer'),
    cssnext                 = require('postcss-cssnext'),
    postcssImport           = require('postcss-import'),
    styleLint               = require('stylelint'),
    postcssDiscardComments  = require('postcss-discard-comments'),
    browserSync             = require('browser-sync').create(),
    cssnano                 = require('cssnano');

var processors = [
        styleLint({
            config: {
                "extends": "stylelint-config-standard",
            },
            plugins: [
                "stylelint-declaration-strict-value"
            ],
            rules: {
                "number-leading-zero": null,
                "custom-property-empty-line-before": null,
                "declaration-colon-space-after": null,
                "indentation": [4, {
                    ignore: ["value"]
                }],
                "value-no-vendor-prefix": true,
                "property-no-vendor-prefix": true,
                "scale-unlimited/declaration-strict-value": [
                    ["/color/", "box-shadow", "border", "background"],
                    {"ignoreKeywords": ["inherit", "currentColor", "transparent", "none"]}
                ]
            }
        }),
        postcssImport,
        cssnext,
        postcssDiscardComments,
        cssnano({autoprefixer: false, safe: true})
    ],
    gulpDir = process.cwd(),
    cssConfig = gulpDir + "/ui/_config.css";

//  Tasks

gulp.task('serve', ['allCss'], function() {
    browserSync.init({
        server: "./",
        port: 3002,
        ui: { port: 3003 }
    });

    gulp.watch(blue-shark/ui/**/**/_*.css", ['css']);
    gulp.watch([blue-shark/ui/_config.css", "ui/_theme.css"], ['allCss']);
    gulp.watch(blue-shark/ui/**/**/*.html").on('change', browserSync.reload);
});

gulp.task('css', function() {

    return gulp.src([blue-shark/ui/**/**/_*.css", "!ui/**/**/_config.css"])
        .pipe(rename(function(path) {
            path.basename = path.basename.substring(1);
        }))
        .pipe(newer({dest: './ui'}))
        .pipe(header("@import '" + cssConfig + "';"))
        .pipe(postcss(processors))
        .pipe(gulp.dest('./ui'))
        .pipe(browserSync.stream());
});

gulp.task('allCss', function() {

    return gulp.src([blue-shark/ui/**/**/_*.css", "!ui/**/**/_config.css"])
        .pipe(rename(function(path) {
            path.basename = path.basename.substring(1);
        }))
        .pipe(header("@import '" + cssConfig + "';"))
        .pipe(postcss(processors))
        .pipe(gulp.dest('./ui'))
        .pipe(browserSync.stream());
});

// Default task to be run with `gulp`
gulp.task('default', ['serve']);
