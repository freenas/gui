SystemJS.config({
    baseURL: '/node_modules',
    packages: {
        'core': {
            defaultExtension: 'js'
        },
        'dao': {
            defaultExtension: 'js'
        },
        'montage': {
            defaultExtension: 'js'
        }
    },
    packageConfigPaths: ['./node_modules/*/package.json'],
    map: {
        json:           './node_modules/systemjs-plugin-json/json.js',
        redux:          './node_modules/redux/dist/redux.min.js',
        bluebird:       './node_modules/montage/node_modules/bluebird/js/browser/bluebird.min.js',
        core:           './core',
        dao:            './core/dao'
    },
    meta: {
        '*.mjson': {
            loader: 'json'
        }
    }
});

