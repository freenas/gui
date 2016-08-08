var Montage = require("montage").Montage,
    Model = require("core/model/model").Model,
    BackEndBridgeModule = require("../backend/backend-bridge");

var SystemDatasetService = exports.SystemDatasetService = Montage.specialize({

    _instance: {
        value: null
    },

    _dataService: {
        value: null
    },

    _systemDatasetService: {
        value: null
    },

    _backendBridge: {
        value: null
    },

    getBootpoolConfig: {
        value: function() {
            var self = this;
            return this._callBackend("boot.pool.get_config",[]).then(function(response) {
                return response.data;
            })
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
            if(!this._instance) {
                this._instance = new SystemDatasetService();
                this._instance._backendBridge = BackEndBridgeModule.defaultBackendBridge;
                this._instance._systemDatasetService = SystemDatasetService.instance;
            }
            return this._instance;
        }
    }
});
