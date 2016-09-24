var AbstractDao = require("core/dao/abstract-dao").AbstractDao,
    FreeNASService = require("core/service/freenas-service").FreeNASService,
    BackEndBridgeModule = require("../backend/backend-bridge"),
    Model = require("core/model/model").Model;

exports.VmTemplateDao = AbstractDao.specialize({
    init: {
        value: function(backendBridge, dataService) {
            this._backendBridge = backendBridge || BackEndBridgeModule.defaultBackendBridge;
            this._dataService = dataService || FreeNASService.instance;
        }
    },

    list: {
        value: function() {
            var self = this;
            return this._backendBridge.send("rpc", "call", {
                method: "vm.template.query", 
                args: []
            }).then(function(response) {
                return Promise.all(response.data.map(function(x) {
                    return self._dataService.mapRawDataToType(x, Model.Vm);
                }));
            });
        }
    }
});
