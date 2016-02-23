#!/usr/bin/env node

var prompt = require('prompt');
var WebSocketClient = require('./websocket-client').WebSocketClient;
var WebSocketConfiguration = require('../../../core/backend/websocket-configuration').WebSocketConfiguration;
var Promise = require('montage/core/promise').Promise;

var passwordSchema = {
        properties: {
            password: {
                hidden: true,
                required: true
            }
        }
    },

    loginSchema = {
        properties: {
            username: {
                required: true
            }
        }
    };

var _userConnection = null;

loginSchema.properties.password = passwordSchema.properties.password;

exports.authenticateIfNeeded = function (username, password, options) {
    if (_userConnection) {
        return Promise.resolve(_userConnection);
    }

    return new Promise(function (resolve, reject) {
        if (!password|| !username) {
            prompt.start();

            console.log("authentication required!");

            prompt.get(username ? passwordSchema : loginSchema, function (error, result) {
                if (error) {
                    reject(error);
                    return void 0;
                }

                resolve(_authenticate(username || result.username, result.password, options));
            });

        } else {
            resolve(_authenticate(username, password, options));
        }
    });
};


function _authenticate (username, password, options) {
    var webSocketConfiguration = new WebSocketConfiguration();

    webSocketConfiguration.set(WebSocketConfiguration.KEYS.SECURE, options ? options.secure : false);
    webSocketConfiguration.set(WebSocketConfiguration.KEYS.HOST, options && options.host ? options.host : "freenas.local");
    webSocketConfiguration.set(WebSocketConfiguration.KEYS.PORT, options && options.port ? options.port : "5000");
    webSocketConfiguration.set(WebSocketConfiguration.KEYS.PATH, "/socket");

    var websocket = new WebSocketClient(webSocketConfiguration);

    return websocket.connect().then(function () {
        return websocket.authenticate(username, password).then(function () {
            if (global.verbose) {
                console.log("Used Connected");
            }

            return (_userConnection = websocket);
        });
    });
}
