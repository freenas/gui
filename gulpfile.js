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
    cssnano                 = require('cssnano'),
    ts                      = require('gulp-typescript');

var tsProject = ts.createProject('tsconfig.json'),
    processors = [
        styleLint({
            config: {
                "extends": "stylelint-config-standard",
            },
            rules: {
                "number-leading-zero": null,
                "custom-property-empty-line-before": null,
                "declaration-colon-space-after": null,
                "indentation": [4, {
                    ignore: ["value"]
                }],
                "value-no-vendor-prefix": true,
                "property-no-vendor-prefix": true
            }
        }),
        postcssImport,
        cssnext,
        postcssDiscardComments,
        cssnano({autoprefixer: false, safe: true})
    ],
    gulpDir   = process.cwd(),
    cssConfig = gulpDir + "/node_modules/blue-shark/ui/_config.css";

// Tasks

gulp.task('serve', ['allCss'], function() {
    browserSync.init({
        server: "./"
    });

    gulp.watch("ui/**/**/_*.css", ['css']);
    gulp.watch("ui/**/*.html").on('change', browserSync.reload);
    gulp.watch("**/*.ts", ['typescript']);
});


gulp.task('css', function() {

    return gulp.src('ui/**/**/_*.css')
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

    return gulp.src('ui/**/**/_*.css')
        .pipe(rename(function(path) {
            path.basename = path.basename.substring(1);
        }))
        .pipe(header("@import '" + cssConfig + "';"))
        .pipe(postcss(processors))
        .pipe(gulp.dest('./ui'))
        .pipe(browserSync.stream());
});

gulp.task('typescript', function(){
  gulp.src(['**/*.ts', '!**/node_modules/**'])
    .pipe(tsProject())
    .pipe(gulp.dest('.'))
});

// Default task to be run with `gulp`
gulp.task('default', ['serve']);
