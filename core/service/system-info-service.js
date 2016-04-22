var Montage = require("montage").Montage,
    BackEndBridgeModule = require("../backend/backend-bridge");

var SystemInfoService = exports.SystemInfoService = Montage.specialize({
    _NAMESPACE: {
        value: 'system.info.'
    },

    _instance: {
        value: null
    },

    _backendBridge: {
        value: null
    },

    getVersion: {
        value: function() {
            return this._callBackend('version').then(function(response) {
                return response.data;
            });
        }
    },

    getHardware: {
        value: function() {
            return this._callBackend('hardware').then(function(response) {
                return response.data;
            });
        }
    },

    getUname: {
        value: function() {
            return this._callBackend('uname_full').then(function(response) {
                return response.data;
            });
        }
    },

    getTime: {
        value: function() {
            return this._callBackend('time').then(function(response) {
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
                this._instance = new SystemInfoService();
                this._instance._backendBridge = BackEndBridgeModule.defaultBackendBridge;
            }
            return this._instance;
        }
    }
});
