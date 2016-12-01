var Montage = require("montage").Montage,
    MiddlewareClient = require("core/service/middleware-client").MiddlewareClient,
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
            return this._middlewareClient.callRpcMethod(this._NAMESPACE + method, args);
        }
    }

}, {
    instance: {
        get: function() {
            if (!this._instance) {
                this._instance = new SystemInfoService();
                this._instance._dataService = FreeNASService.instance;
                this._instance._middlewareClient = MiddlewareClient.getInstance()
            }
            return this._instance;
        }
    }
});
