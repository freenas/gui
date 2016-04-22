var Montage = require("montage").Montage,
    BackEndBridgeModule = require("../backend/backend-bridge");

var SystemDeviceService = exports.SystemDeviceService = Montage.specialize({
    _NAMESPACE: {
        value: 'system.device.'
    },

    _instance: {
        value: null
    },

    _backendBridge: {
        value: null
    },

    getDisks: {
        value: function() {
            return this._callBackend('get_devices', ['disk']).then(function(response) {
                return response.data;
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
    }

}, {
    instance: {
        get: function() {
            if (!this._instance) {
                this._instance = new SystemDeviceService();
                this._instance._backendBridge = BackEndBridgeModule.defaultBackendBridge;
            }
            return this._instance;
        }
    }
});
