/**
 * @constructor HandlerPool
 *
 * @description Contains all the pending deferred promise handlers that have been sent to the server.
 * Those pending handlers will be removed from this pool when the command will have been resolved or when their timeout will occur.
 *
 */
var HandlerPool = exports.HandlerPool = function HandlerPool () {
    this.pool = Object.create(null);
    this._timeouts = new Set();
};


var UUID_PATTERN = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx",
    TIMEOUT_HANDLER = { timeout: true };

HandlerPool.prototype.handlerTimeout = 5000;


/*----------------------------------------------------------------------------------------------------------------------
                                                Public Functions
----------------------------------------------------------------------------------------------------------------------*/


/**
 * @function
 * @public
 *
 * @description todo
 *
 * @param {Number} timeout - A Promise Object.
 *
 */
HandlerPool.prototype.initWithHandlerTimeout = function (timeout) {
    this.handlerTimeout = +timeout || 0;

    return this;
};


/**
 * @function
 * @public
 *
 * @param {Object} handler - An Object.
 * @param {Object} uuid - An unique universal id.
 *
 * @description Add a handler to the pool.
 *
 * @returns {String} returns an unique ID.
 *
 */
HandlerPool.prototype.addHandler = function (handler, uuid) {
    uuid = uuid || this._generateUUID();

    this.pool[uuid] = handler;
    handler.uuid = uuid;

    return uuid;
};


/**
 * @function
 * @public
 *
 * @param {String} uuid - An unique ID.
 *
 * @description Releases a handler from the pool with its unique ID.
 *
 * @returns {Object} returns the released handler.
 *
 */
HandlerPool.prototype.releaseHandler = function (uuid) {
    var handler = this.findHandler(uuid);

    if (handler) {
        if (handler.timeoutID !== void 0 && handler.timeoutID !== null) {
            clearTimeout(handler.timeoutID);
        }

        delete this.pool[uuid];
    }

    return handler;
};


/**
 * @function
 * @public
 *
 * @description todo.
 *
 * @param {String} uuid - An unique ID.
 *
 * @returns {Object} returns the released handler.
 *
 */
HandlerPool.prototype.findHandler = function (uuid) {
    var handler;

    if ((typeof uuid === "string" || typeof uuid === "number")) {
        handler = this.pool[uuid];
        if (!handler && this._timeouts.has(uuid)) {
            this._removeFromTimeout(uuid);
            handler = TIMEOUT_HANDLER;
        }
    }

    return handler;
};


/**
 * @function
 * @public
 *
 * @description todo.
 *
 * @param {Object} handler
 * @param {Number} timeout
 *
 */
HandlerPool.prototype.setTimeoutToHandler = function (handler, timeout) {
    var self = this,
        uuid = handler.uuid;

    timeout = +timeout || this.handlerTimeout;

    if (timeout) {
        handler.timeoutID = setTimeout(function () {
            var messageHandler = self.pool[uuid];

            if (handler === messageHandler) {
                messageHandler.reject(new Error("response timeout"));

                delete self.pool[uuid];
                self._markAsTimeout(uuid);
            }
        }, timeout);
    }
};


/**
 * @function
 * @public
 *
 * @description todo.
 *
 */
HandlerPool.prototype.clear = function () {
    var keys = Object.keys(this.pool);

    for (var i = 0, length = keys.length ; i < length; i++) {
        this.releaseHandler(keys[i]);
    }
};


/**
 * @function
 * @public
 *
 * @description todo.
 *
 */
HandlerPool.prototype.rejectAll = function (error) {
    var keys = Object.keys(this.pool);

    for (var i = 0, length = keys.length ; i < length; i++) {
        this.releaseHandler(keys[i]).reject(error);
    }
};


/*----------------------------------------------------------------------------------------------------------------------
                                                Private Functions
----------------------------------------------------------------------------------------------------------------------*/

HandlerPool.prototype._markAsTimeout = function(uuid) {
    this._timeouts.add(uuid);
}

HandlerPool.prototype._removeFromTimeout = function(uuid) {
    this._timeouts.delete(uuid);
}

/**
 * @function
 * @private
 *
 * @description todo
 *
 * @returns {String} uuid
 *
 */
HandlerPool.prototype._generateUUID = function () {
    return UUID_PATTERN.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0;
            var v = (c === "x") ? r : (r & 0x3 | 0x8);

            return v.toString(16);
        }
    );
};
