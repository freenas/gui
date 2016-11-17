var path                    = require('path');
    gulp                    = require('gulp'),
    postcss                 = require('gulp-postcss'),
    header                  = require('gulp-header'),
    rename                  = require('gulp-rename'),
    newer                   = require('gulp-newer'),
    cssnext                 = require('postcss-cssnext'),
    postcssImport           = require('postcss-import'),
    postcssDiscardComments  = require('postcss-discard-comments'),
    browserSync             = require('browser-sync').create(),
    cssnano                 = require('cssnano'),
    ts                      = require('gulp-typescript');

var tsProject = ts.createProject('tsconfig.json');

gulp.task('serve', ['css'], function() {
    browserSync.init({
        server: "./"
    });

    gulp.watch("ui/**/**.reel/_*.css", ['css']);
    gulp.watch("ui/**/*.html").on('change', browserSync.reload);
    gulp.watch("**/*.ts", ['typescript']);
});


gulp.task('css', function() {
    var processors = [
        postcssImport,
        cssnext,
        postcssDiscardComments,
        cssnano({autoprefixer: false, safe: true})
    ];

    return gulp.src(['ui/**/**.reel/_*.css', '!ui/**/**.info/{,/**}'])
        .pipe(rename(function(path) {
            path.basename = path.basename.substring(1);
        }))
        .pipe(newer({dest: './ui'}))

        .pipe(postcss(processors))
        .pipe(gulp.dest('./ui'))
        .pipe(browserSync.stream());
});

gulp.task('allCss', function() {
    var processors = [
        postcssImport,
        cssnext,
        postcssDiscardComments,
        cssnano({autoprefixer: false})
    ];

    return gulp.src(['ui/**/**.reel/_*.css', '!ui/**/**.info/{,/**}'])
        .pipe(rename(function(path) {
            path.basename = path.basename.substring(1);
        }))

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
