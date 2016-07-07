var Montage = require("montage").Montage,
    BackEndBridgeModule = require("../backend/backend-bridge");

var VirtualMachineService = exports.VirtualMachineService = Montage.specialize({
    _instance: {
        value: null
    },

    _backendBridge: {
        value: null
    },

    getTemplates: {
        value: function() {
            return this._callBackend("vm.template.query", []).then(function(templates) {
                return templates.data;
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
                this._instance._backendBridge = BackEndBridgeModule.defaultBackendBridge;
            }
            return this._instance;
        }
    }
});
