var Montage = require("montage").Montage,
    BackEndBridgeModule = require("../backend/backend-bridge");

var SystemService = exports.SystemService = Montage.specialize({
    _NAMESPACE: {
        value: 'system.'
    },

    _instance: {
        value: null
    },

    _dataService: {
        value: null
    },

    _backendBridge: {
        value: null
    },

    reboot: {
        value: function() {
            return this._submitTask('reboot').then(function(response) {
                return response.data;
            });
        }
    },

    shutdown: {
        value: function() {
            return this._submitTask('shutdown').then(function(response) {
                return response.data;
            });
        }
    },

    _submitTask: {
        value: function(taskName, args) {
            args = args || [];
            return this._backendBridge.send("rpc", "call", {
                method: 'task.submit',
                args: [this._NAMESPACE + taskName, args]
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
