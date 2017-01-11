var path = require('path'),
    gulp = require('gulp'),
    header = require('gulp-header'),
    rename = require('gulp-rename'),
    newer = require('gulp-newer'),
    file = require("gulp-file"),
    postcss = require('gulp-postcss'),
    cssnext = require('postcss-cssnext'),
    postcssImport = require('postcss-import'),
    styleLint = require('stylelint'),
    postcssDiscardComments = require('postcss-discard-comments'),
    browserSync = require('browser-sync').create(),
    cssnano = require('cssnano'),
    del = require("del"),
    git = require("git-rev-sync"),
    ts = require('gulp-typescript');

var tsProject = ts.createProject('tsconfig.json'),
    tsProjectProd = ts.createProject('tsconfig.json', {sourceMap: false}),
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
    gulpDir = process.cwd(),
    cssConfig = gulpDir + "/node_modules/blue-shark/ui/_config.css",
    rollbarDevConfig =  "window._FREENAS_ENVIRONMENT = 'development';\n" +
                        "window._FREENAS_GIT_SHA = 'master';",
    rollbarProdConfig = "window._FREENAS_ENVIRONMENT = 'production';\n" +
                        "window._FREENAS_GIT_SHA = '" + git.long() + "';";

// Tasks

gulp.task('serve', ['allCss', 'typescript'], function () {
    browserSync.init({
        server: "./"
    });

    gulp.watch("ui/**/**/_*.css", ['css']);
    gulp.watch("ui/**/*.html").on('change', browserSync.reload);
    gulp.watch("**/*.ts", ['typescript']);
});


gulp.task('css', function () {

    return gulp.src('ui/**/**/_*.css')
        .pipe(rename(function (path) {
            path.basename = path.basename.substring(1);
        }))
        .pipe(newer({dest: './ui'}))
        .pipe(header("@import '" + cssConfig + "';"))
        .pipe(postcss(processors))
        .pipe(gulp.dest('./ui'))
        .pipe(browserSync.stream());
});

gulp.task('allCss', function () {

    return gulp.src('ui/**/**/_*.css')
        .pipe(rename(function (path) {
            path.basename = path.basename.substring(1);
        }))
        .pipe(header("@import '" + cssConfig + "';"))
        .pipe(postcss(processors))
        .pipe(gulp.dest('./ui'))
        .pipe(browserSync.stream());
});

gulp.task('typescript', function () {
    return tsProject.src()
        .pipe(tsProject())
        .pipe(gulp.dest('core'));
});

gulp.task('typescriptProd', function () {
    return tsProjectProd.src()
        .pipe(tsProjectProd())
        .pipe(gulp.dest('core'));
});

gulp.task('tagRollbar', function () {
    return del([
        'rollbar_runtime_config.js'
    ]).then(function() {
        return file('rollbar_runtime_config.js', rollbarProdConfig)
            .pipe(gulp.dest('.'));
    });
});

gulp.task('build', [
    'allCss',
    'typescriptProd',
    'tagRollbar'
]);

gulp.task('clean', function () {
    return del([
        'ui/**/**/*.css',
        '!ui/**/**/_*.css',
        'core/*.*',
        'core/backend',
        'core/controller',
        'core/converter',
        'core/dao',
        'core/reducers',
        'core/repository',
        'core/route',
        'core/service',
        'rollbar_runtime_config.js'
    ]).then(function() {
        return file('rollbar_runtime_config.js', rollbarDevConfig)
            .pipe(gulp.dest('.'));
    });
});

gulp.task('default', ['serve']);
