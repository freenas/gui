var webpack = require('webpack'),
    path = require('path');

var libraryName = 'freenas-repository',
    plugins = [],
    outputFile;

outputFile = libraryName + '.js';

var config = {
    entry: {
        client: __dirname + '/src/service/middleware-client.ts',
        repository: __dirname + '/src/repository/index.ts'
    },
    devtool: 'source-map',
    output: {
        path: path.join(__dirname, '/bin'),
        filename: '[name].js',
        library: ['freenas', '[name]'],
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                enforce: 'pre',
                use: [
                    'tslint-loader'
                ]
            },
            {
                test: /\.ts$/,
                use: [
                    'ts-loader'
                ]
            }
        ]
    },
    resolve: {
        modules: [
            path.resolve('./src'),
            'node_modules'
        ],
        extensions: [ '.js', '.ts' ]
    },
    plugins: plugins
};

module.exports = config;
