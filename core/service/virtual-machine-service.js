var Montage = require("montage").Montage,
    FreeNASService = require("core/service/freenas-service").FreeNASService,
    BackEndBridgeModule = require("../backend/backend-bridge"),
    Model = require("core/model/model").Model;

var VirtualMachineService = exports.VirtualMachineService = Montage.specialize({
    _instance: {
        value: null
    },

    _dataService: {
        value: null
    },

    _backendBridge: {
        value: null
    },

    getTemplates: {
        value: function() {
            var self = this;
            return this._callBackend("vm.template.query", []).then(function(templates) {
                var results = [];
                for (var i = 0, length = templates.data.length; i < length; i++) {
                    results.push(self._dataService.mapRawDataToType(templates.data[i], Model.Vm));
                }
                return Promise.all(results);
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
                this._instance = new VirtualMachineService();
                this._instance._dataService = FreeNASService.instance;
                this._instance._backendBridge = BackEndBridgeModule.defaultBackendBridge;
            }
            return this._instance;
        }
    }
});
