var Client = require('websocket').client;
var WebSocketMessage = require('../../core/backend/websocket-message').WebSocketMessage;
var WebSocketConfiguration = require('../../core/backend/websocket-configuration').WebSocketConfiguration;
var HandlerPool = require('../../core/backend/handler-pool').HandlerPool;
var Promise = require('montage/core/promise').Promise;


var WebSocketClient = exports.WebSocketClient = function (webSocketConfiguration) {
    this.client = new Client();
    this.handlerPool = new HandlerPool();
    this.configuration = webSocketConfiguration;
};

WebSocketClient.prototype.connect = function () {
    var client = this.client;
    var configuration = this.configuration;
    var self = this;

    return new Promise(function (resolve, reject) {
        client.on('connectFailed', function (error) {
            console.log('Connection Failed: ' + error.toString());

            reject(error);
        });

        client.on('connect', function (connection) {
            self.connection = connection;

            if (global.verbose) {
                console.log('Connected');
            }

            connection.on('error', function (error) {
                console.log("Connection Error: " + error.toString());
            });

            connection.on('close', function () {
                console.log('Connection Closed');
            });

            connection.on('message', function (message) {
                var response,
                    errorMessage;

                try {
                    response = JSON.parse(message.utf8Data);

                } catch (error) {
                    errorMessage = error;
                }

                if (response) {
                    var deferred = self.handlerPool.releaseHandler(response.id);

                    if (deferred) {
                        deferred.resolve(response);
                    }
                }
            });

            resolve(connection);
        });

        if (global.verbose) {
            console.log('Connecting to: ' + configuration.get(WebSocketConfiguration.KEYS.URL));
        }

        client.connect(configuration.get(WebSocketConfiguration.KEYS.URL));
    });
};


WebSocketClient.prototype.send = function (namespace, name, args) {
    if (this.connection.connected) {
        var self = this;

        return new Promise(function (resolve, reject) {
            var message = new WebSocketMessage(namespace, name, args);

            message.id = self.handlerPool.addHandler({
                resolve: resolve,
                reject: reject
            });

            if (global.verbose) {
                console.log("Message Sent: '" + message.toJSON() + "'");
            }

            self.connection.send(message);
        });
    }

    return Promise.reject("not connected!");
};

WebSocketClient.prototype.authenticate = function (username, password) {
    if (this.connection.connected) {
        if (global.verbose) {
            console.log('User Authenticating...');
        }

        return this.send("rpc", "auth", {
            username : username,
            password : password
        });
    }

    return Promise.reject("not connected!");
};
