var Montage = require("montage").Montage,
    WebSocketClient = require("core/backend/websocket-client").WebSocketClient,
    WebSocketConfiguration = require("/core/backend/websocket-configuration").WebSocketConfiguration,
    MiddlewareClient = require("core/service/middleware-client").MiddlewareClient,
    BackEndBridgeModule = require("../backend/backend-bridge");

var FilesystemService = exports.FilesystemService = Montage.specialize({
    _SEP: {
        value: '/'
    },

    _instance: {
        value: null
    },

    dirname: {
        value: function(path) {
            if (path == "/") {
                return "";
            } else {
                var result = path.substring(0, path.lastIndexOf(this._SEP));
                if (result.length === 0) {
                    result += "/";
                }
                return result;
            }
        }
    },

    basename: {
        value: function(path) {
            return path.substring(path.lastIndexOf(this._SEP)+1);
        }
    },

    join: {
        value: function(dirname, basename) {
            if (!basename || basename.length == 0) {
                return dirname;
            }
            var separator = dirname.substr(dirname.length - 1) == this._SEP ? '' : this._SEP;
            return dirname + separator + basename;
        }
    },

    listDir: {
        value: function(path) {
            return this._callBackend("filesystem.list_dir", [path]).then(function(response) {
                return response;
            });
        }
    },


    stat: {
        value: function(path) {
            var self = this;
            return this._callBackend("filesystem.stat", [path]).then(function(response) {
                var result = response;
                result.name = self.basename(path);
                return result;
            });
        }
    },

    submitTaskWithUpload: {
        value: function(file, taskName, args) {
            var self = this;

            return this._callBackend(taskName, args).then(function (response) {
                // FIXME: SHOULD BE IN ITS OWN METHOD (and less magical) - pchaussalet
                var token = Array.isArray(response) ? response[1][0] : response,
                    connection = new WebSocketClient().initWithUrl(
                        WebSocketConfiguration.fileUploadConfiguration.get(WebSocketConfiguration.KEYS.URL)
                    ),
                    BUFSIZE = 1024;


                connection.addEventListener('webSocketOpen', function () {
                    var filePos = 0;
                    //Send token before sending file.
                    connection.sendMessage(JSON.stringify({token: token}));


                    while (filePos + BUFSIZE <= file.size) {
                        self._sendBlob(connection, file, filePos, filePos + BUFSIZE);
                        filePos = filePos + BUFSIZE;
                    }

                    if (filePos < file.size) {
                        self._sendBlob(connection, file, filePos, file.size);
                    }
                }, false);

                connection.addEventListener('webSocketError', function () {
                    // todo
                }, false);

                return connection.connect().then(function() {
                    connection.addEventListener('webSocketClose', function () {
                        // todo
                    }, false);
                });
            });
        }
    },

    restoreDatabase: {
        value: function (file) {
            return this.submitTaskWithUpload(file, "task.submit_with_upload", ["database.restore", [null]]);
        }
    },

    uploadFile: {
        value: function (file, destinationPath, mode) {
            return this.submitTaskWithUpload(file, "filesystem.upload", ["/root/" + file.name, file.size, mode ||"755"]);
        }
    },

    _sendBlob: {
        value: function (connection, file, startByte, stopByte) {
            var start = parseInt(startByte) || 0,
                stop = parseInt(stopByte) || file.size,
                reader = new FileReader();

            reader.onloadend = function (event) {
                var target = event.target;

                if (target.readyState === FileReader.DONE) { // DONE == 2
                    connection.sendMessage(target.result);

                    if (stop === file.size) {
                        connection.sendMessage("");
                    }
                }
            };

            var blob = file.slice(start, stop);
            reader.readAsArrayBuffer(blob);
        }
    },

    _callBackend: {
        value: function(method, args) {
            return this._middlewareClient.callRpcMethod(method, args);
        }
    }

}, {
    instance: {
        get: function() {
            if (!this._instance) {
                this._instance = new FilesystemService();
                this._instance._middlewareClient = MiddlewareClient.getInstance();
            }
            return this._instance;
        }
    }
});
