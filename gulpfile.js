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
    named = require("vinyl-named"),
    webpackStream = require("webpack-stream"),
    webpack2 = require("webpack"),
    ts = require('gulp-typescript');

var tsProject = ts.createProject('tsconfig.json'),
    tsProjectProd = ts.createProject('tsconfig.json', {sourceMap: false}),
    processors = [
        styleLint({
            config: {
                "extends": "stylelint-config-standard"
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
    cssConfig = gulpDir + "/node_modules/blue-shark/ui/_config.css",
    rollbarDevConfig =  "window._FREENAS_ENVIRONMENT = 'development';\n" +
                        "window._FREENAS_GIT_SHA = 'master';",
    rollbarProdConfig = "window._FREENAS_ENVIRONMENT = 'production';\n" +
                        "window._FREENAS_GIT_SHA = '" + git.long() + "';";

// Tasks

gulp.task('serve', ['allCss', 'packageUuid', 'typescript'], function () {
    browserSync.init({
        server: "./"
    });

    gulp.watch("ui/**/**/_*.css", ['css']);
    gulp.watch("ui/**/*.html").on('change', browserSync.reload);
    gulp.watch("src/**/*.ts", ['typescript']);
    gulp.watch("src/**/*.js", ['typescript']);
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

gulp.task('packageUuid', function() {
    return gulp.src('node_modules/uuid/index.js')
        .pipe(named())
        .pipe(webpackStream({
            output: {
                filename: 'index.js',
                library: 'uuid',
                libraryTarget: 'umd'
            }
        }), webpack2)
        .pipe(gulp.dest('bin/vendors/uuid'))
});

gulp.task('build', [
    'allCss',
    'packageUuid',
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

gulp.task('test-e2e', require('./gulp-tasks/test-e2e')(gulp));

gulp.task('default', ['serve']);
