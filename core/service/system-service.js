var Montage = require("montage").Montage,
    BackEndBridgeModule = require("../backend/backend-bridge");

var SystemService = exports.SystemService = Montage.specialize({
    _instance: {
        value: null
    },

    _dataService: {
        value: null
    },

    _backendBridge: {
        value: null
    },

    changeBootPool: {
        value: function(bootPool) {
            return this._submitTask('system_dataset.migrate', [bootPool]).then(function(response) {
                return response.data;
            })
        }
    },

    reboot: {
        value: function() {
            return this._submitTask('system.reboot').then(function(response) {
                return response.data;
            });
        }
    },

    shutdown: {
        value: function() {
            return this._submitTask('system.shutdown').then(function(response) {
                return response.data;
            });
        }
    },

    _submitTask: {
        value: function(taskName, args) {
            args = args || [];
            return this._backendBridge.send("rpc", "call", {
                method: 'task.submit',
                args: [taskName, args]
            });

        }
    },

    _callBackend: {
        value: function(method, args) {
            args = args || [];
            return this._backendBridge.send("rpc", "call", {
                method: this._NAMESPACE + method,
                args: args
            });
        }
    },

    _fetchGeneral: {
        value: function() {

        }
    }
}, {
    instance: {
        get: function() {
            if (!this._instance) {
                this._instance = new SystemService();
                this._instance._backendBridge = BackEndBridgeModule.defaultBackendBridge;
            }
            return this._instance;
        }
    }
});
