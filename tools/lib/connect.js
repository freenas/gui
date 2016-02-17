#!/usr/bin/env node

var prompt = require('prompt');
var WebSocketClient = require('./websocket-client').WebSocketClient;
var WebSocketConfiguration = require('../../core/backend/websocket-configuration').WebSocketConfiguration;
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

var _isUserConnected = false,
    _userConnection = null;

loginSchema.properties.password = passwordSchema.properties.password;

exports.authenticateIfNeeded = function (username, password, option) {
    if (_isUserConnected) {
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

                resolve(_authenticate(username || result.username, result.password, option));
            });

        } else {
            resolve(_authenticate(username, password, option));
        }
    });
};


function _authenticate (username, password, option) {
    var webSocketConfiguration = new WebSocketConfiguration();

    webSocketConfiguration.set(WebSocketConfiguration.KEYS.SECURE, option ? option.secure : false);
    webSocketConfiguration.set(WebSocketConfiguration.KEYS.HOST, option && option.host ? option.host : "freenas.local");
    webSocketConfiguration.set(WebSocketConfiguration.KEYS.PORT, option && option.port ? option.port : "5000");
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
