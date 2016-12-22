SystemJS.config({
    map: {
        json: 'node_modules/systemjs-plugin-json/json.js'
    },
    meta: {
        '*.mjson': {
            loader: 'json'
        }
    }
});

