var WebSocket = require('ws');
var WebSocketMessage = require('../../../core/backend/websocket-message').WebSocketMessage;
var HandlerPool = require('../../../core/backend/handler-pool').HandlerPool;
var Promise = require('montage/core/promise').Promise;


var WebSocketClient = exports.WebSocketClient = function () {
    this.handlerPool = new HandlerPool();
};

WebSocketClient.prototype.connect = function (url) {

    if (global.verbose) {
        console.log('Connecting to: ' + url);
    }

    var client = this.client = new WebSocket(url);
    var self = this;

    return new Promise(function (resolve, reject) {
        client.on('connectFailed', function (error) {
            console.log('Connection Failed: ' + error.toString());

            reject(error);
        });

        client.on('error', function (error) {
            console.log("Connection Error: " + error.toString());
            reject(error);
        });

        client.on('open', function () {
            if (global.verbose) {
                console.log('Connected');
            }

            client.on('close', function () {
                console.log('Connection Closed');
            });

            client.on('message', function (message) {
                var response,
                    errorMessage;

                try {
                    response = JSON.parse(message);

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

            resolve(client);
        });
    });
};


WebSocketClient.prototype.send = function (namespace, name, args) {
    if (this.client.readyState === WebSocket.OPEN) {
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

            self.client.send(JSON.stringify(message));
        });
    }

    return Promise.reject("not connected!");
};

WebSocketClient.prototype.authenticate = function (username, password) {
    if (global.verbose) {
        console.log('User Authenticating...');
    }

    return this.send("rpc", "auth", {
        username : username,
        password : password
    });
};
