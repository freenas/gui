/*global require, exports, Error*/
var Target = require("montage/core/target").Target,
    WebSocketClient = require("./websocket-client").WebSocketClient,
    WebSocketMessage = require("./websocket-message").WebSocketMessage,
    WebSocketResponse = require("./websocket-response").WebSocketResponse,
    WebSocketConfiguration = require("./websocket-configuration").WebSocketConfiguration,
    HandlerPool = require("./handler-pool").HandlerPool,
    Promise = require("montage/core/promise").Promise;


var RPC_NAME_SPACE = "rpc",
    EVENTS_NAME_SPACE = "events",
    EVENT_NAME = "event",
    RESPONSE_NAME = "response";


/**
 * @class
 * @extends Target
 *
 * @description Object used as a bridge to the backend.
 *
 */
var BackEndBridge = exports.BackEndBridge = Target.specialize({


    /*------------------------------------------------------------------------------------------------------------------
                                                    Public Functions
     -----------------------------------------------------------------------------------------------------------------*/
    /**
     * @public
     *
     * @description todo
     *
     */
    initWithConfiguration: {
        value: function (configuration) {
            this.host = configuration.get(WebSocketConfiguration.KEYS.HOST);
            this._connection = new WebSocketClient().initWithUrl(configuration.get(WebSocketConfiguration.KEYS.URL));
            this._handlerPool = new HandlerPool().initWithHandlerTimeout(configuration.get(WebSocketConfiguration.KEYS.TIMEOUT));

            this._connection.delegate = this;
            this._connection.responseType = WebSocketClient.RESPONSE_TYPE.JSON;
            this._connection.addEventListener("webSocketMessage", this);
            this._connection.addEventListener("webSocketStatusChange", this);
            this._connection.addEventListener("webSocketError", this);

            return this;
        }
    },


    /**
     * @function
     * @public
     *
     * @description Try to establish a connection to the server.
     *
     * @returns {Promise}
     *
     */
    connect: {
        value: function () {
            return this._connection.connect();
        }
    },


    /**
     * @function
     * @public
     *
     * @description todo
     *
     * @returns {Promise}
     *
     */
    reConnect: {
        value: function () {
            this._handlerPool.clear();

            return this._connection.reConnect();
        }
    },


    /**
     * @function
     * @public
     *
     * @description todo
     *
     * @params {Number} code.
     * @params {String} reason.
     *
     */
    disconnect: {
        value: function (code, reason) {
            this._handlerPool.clear();
            
            this._connection.disconnect(code, reason);
        }
    },


    /**
     * @function
     * @public
     *
     * @description todo
     *
     * @params {Object.<WebSocketClient>} webSocket.
     * @params {String} message.
     *
     */
    webSocketWillSendMessage: {
        value: function (webSocket, message) {
            var handler = this._handlerPool.findHandler(message.id);

            if (handler) {
                this._handlerPool.setTimeoutToHandler(handler);
            }

            return JSON.stringify(message);
        }
    },


    /**
     * @function
     * @public
     *
     * @description todo
     *
     * @param {Event} event.
     *
     */
    handleWebSocketMessage: {
        value: function (event) {
            var response = event.detail;

            if (response) {
                this.connectionStatus = this._connection.CONNECTION_CONNECTED;
                if (response.namespace === RPC_NAME_SPACE && response.id) {
                    // try to find a deferred promise that will handle this message according to its UID.
                    var deferred = this._handlerPool.releaseHandler(response.id);

                    if (deferred) {
                        if (!deferred.timeout) {
                            if (response.name === RESPONSE_NAME) {
                                deferred.resolve(new WebSocketResponse(response));

                            } else if (response.name === "error") {
                                if (response.args) {
                                    /**
                                     * FIXME: Need to investigate, it seems that code errors are the same
                                     * when an user is not logged or gives wrong credentials...
                                     */
                                    if (response.args.code === 13) {
                                        if (response.args.message === "Not logged in") {
                                            this.dispatchEventNamed("userDisconnected", true, true);
                                            this.connectionStatus = this._connection.CONNECTION_DISCONNECTED;
                                        }

                                        deferred.reject(new Error(response.args.message));

                                    } else {
                                        deferred.reject(response.args);
                                    }
                                } else {
                                    deferred.reject(new Error("Error message received: " + response));
                                }
                            } else {
                                deferred.reject(new Error("Unknown message received: " + response));
                            }
                        }
                    } else {
                        var payload = typeof response === "object" && response ? JSON.stringify(response) : response;
                        throw new Error("Message received but no handler has been found: " + payload);
                    }
                } else if (response.namespace === EVENTS_NAME_SPACE) {
                    this.dispatchEventNamed(
                        (response.name !== EVENT_NAME ? response.name : response.args.name).toCamelCase(),
                        true,
                        true,
                        response.args.args || response.args);
                }
            }
        }
    },

    handleWebSocketError: {
        value: function (event) {
            if (event.detail.code === WebSocketClient.ERROR_CODE.CONNECTION_FAILED) {
                this._handlerPool.rejectAll(event.detail.message);
            }
        }
    },

    handleWebSocketStatusChange: {
        value: function (event) {
            this.connectionStatus = event.detail.status;
        }
    },


    /**
     * @function
     * @public
     *
     * @description Sends a message.
     *
     * @param {Object.<WebSocketMessage>} message.
     *
     * @returns {Promise}
     *
     */
    sendMessage: {
        value: function (message) {
            if (message instanceof WebSocketMessage) {
                if (message.namespace === RPC_NAME_SPACE) {
                    var self = this;

                    return new Promise(function (resolve, reject) {
                        message.id = self._handlerPool.addHandler({
                            resolve: resolve,
                            reject: reject
                        });

                        self._connection.sendMessage(message);
                    });

                } else {
                    return Promise.resolve(this._connection.sendMessage(message));
                }
            }

            return Promise.reject(new Error("message must be an WebSocketMessage"));
        }
    },


    /**
     * @function
     * @public
     *
     * @description todo
     *
     * @params {String} namespace
     * @params {String} name
     * @params {Array} args
     *
     * @returns {Promise}
     *
     */
    send: {
        value: function (namespace, name, args) {
console.trace('deprecated use of backen-bridge');
            return this.sendMessage(new WebSocketMessage(namespace, name, args));
        }
    },

    /**
     * @function
     * @public
     *
     * @description todo
     *
     * @params {Object} rawMessage.
     *
     */
    sendRaw: {
        value: function (rawMessage) {
            this._connection.sendMessage(rawMessage);
        }
    },

    /**
     * @function
     * @public
     *
     * @description todo
     *
     * @params {String} event
     * @params {Object} listener
     *
     */
    subscribeToEvent: {
        value: function (event, listener) {
            return this.subscribeToEvents([event], listener).then(function (eventTypes) {
                return eventTypes[0];
            });
        }
    },


    /**
     * @function
     * @public
     *
     * @description todo
     *
     * @params {Array.<String>} events
     * @params {Object} listener
     *
     */
    subscribeToEvents: {
        value: function (events, listener) {
            if (this._checkEventsValidity(events)) {
                var self = this;

                return this.send(EVENTS_NAME_SPACE, "subscribe", events).then(function () {
                    return self._addEventListeners(events, listener);
                });
            }

            return Promise.reject("wrong parameters given");
        }
    },


    /**
     * @function
     * @public
     *
     * @description todo
     *
     * @params {String} event
     * @params {Object} listener
     *
     */
    unSubscribeToEvent: {
        value: function (event, listener) {
            return this.unSubscribeToEvents([event], listener);
        }
    },


    /**
     * @function
     * @public
     *
     * @description todo
     *
     * @params {Array.<String>} events
     * @params {Object} listener
     *
     */
    unSubscribeToEvents: {
        value: function (events, listener) {
            if (this._checkEventsValidity(events)) {
                var self = this;

                return this.send(EVENTS_NAME_SPACE, "unsubscribe", events).then(function () {
                    self._removeEventListeners(events, listener);
                });
            }

            return Promise.reject("wrong parameters given");
        }
    },


    /**
     * @function
     * @public
     *
     * @description todo
     *
     * @param {Array} args.
     *
     * @returns {Promise}
     *
     */
    submitTask: {
        value: function (args) {
            return this.send(RPC_NAME_SPACE, "call", {
                method: "task.submit",
                args: args
            });
        }
    },


    /*------------------------------------------------------------------------------------------------------------------
                                                    Private Functions
     -----------------------------------------------------------------------------------------------------------------*/


    /**
     * @function
     * @private
     *
     * @description todo
     *
     * @params {events} events
     *
     */
    _checkEventsValidity: {
        value: function (events) {
            var isValid = events && events.constructor === Array;

            if (isValid) {
                var event;

                for (var i = 0, length = events.length; i < length && isValid === true; i++) {
                    event = events[i];
                    isValid = typeof event === "string" && !!event.length;
                }
            }

            return isValid;
        }
    },


    /**
     * @function
     * @private
     *
     * @description todo
     *
     * @params {Array.<String>} events
     * @params {Object} listener
     * @params {Boolean} useCapture
     *
     */
    _addEventListeners: {
        value: function (events, listener, useCapture) {
            if (listener) {
                var eventTypes = [], eventType;
                for (var i  = 0, length = events.length; i < length; i++) {
                    eventType = events[i].toCamelCase();
                    this.addEventListener(eventType, listener, useCapture);
                    eventTypes.push(eventType);
                }
                return eventTypes;
            }
        }
    },


    /**
     * @function
     * @private
     *
     * @description todo
     *
     * @params {Array.<String>} events
     * @params {Object} listener
     * @params {Boolean} useCapture
     *
     */
    _removeEventListeners: {
        value: function (events, listener, useCapture) {
            if (listener) {
                for (var i  = 0, length = events.length; i < length; i++) {
                    this.removeEventListener(events[i].toCamelCase(), listener, useCapture);
                }
            }
        }
    }

});


var _defaultBackendBridge;

Object.defineProperty(exports, "defaultBackendBridge", {
    set: function (backendBridge) {
        _defaultBackendBridge = backendBridge;
    },
    get: function () {
        return _defaultBackendBridge || (
                _defaultBackendBridge = (
                    new BackEndBridge()
                ).initWithConfiguration(WebSocketConfiguration.defaultConfiguration)
            );
    }
});
