var Montage = require("montage").Montage,
    BackEndBridgeModule = require("../backend/backend-bridge");

var FilesystemService = exports.FilesystemService = Montage.specialize({
    _SEP: {
        value: '/'
    },

    _instance: {
        value: null
    },

    _backendBridge: {
        value: null
    },

    dirname: {
        value: function(path) {
            return path.substring(0, path.lastIndexOf(this._SEP));
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
            return dirname + this._SEP + basename;
        }
    },

    listDir: {
        value: function(path) {
            return this._callBackend("filesystem.list_dir", [path]).then(function(response) {
                return response.data;
            });
        }
    },


    stat: {
        value: function(path) {
            var self = this;
            return this._callBackend("filesystem.stat", [path]).then(function(response) {
                var result = response.data;
                result.name = self.basename(path);
                return result;
            });
        }
    },

    _callBackend: {
        value: function(method, args) {
            return this._backendBridge.send("rpc", "call", {
                method: method,
                args: args
            });
        }
    }

}, {
    instance: {
        get: function() {
            if (!this._instance) {
                this._instance = new FilesystemService();
                this._instance._backendBridge = BackEndBridgeModule.defaultBackendBridge;
            }
            return this._instance;
        }
    }
});
