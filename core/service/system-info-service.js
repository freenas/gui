var Montage = require("montage").Montage,
    BackEndBridgeModule = require("../backend/backend-bridge"),
    FreeNASService = require("core/service/freenas-service").FreeNASService,
    Model = require("core/model/model").Model;

var SystemInfoService = exports.SystemInfoService = Montage.specialize({
    _NAMESPACE: {
        value: 'system.info.'
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
            return this._dataService.fetchData(Model.SystemTime).then(function(systemTime) {
                return systemTime[0];
            });
        }
    },

    getLoad: {
        value: function() {
            return this._callBackend('load_avg').then(function(response) {
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
                this._instance._dataService = FreeNASService.instance;
                this._instance._backendBridge = BackEndBridgeModule.defaultBackendBridge;
            }
            return this._instance;
        }
    }
});
