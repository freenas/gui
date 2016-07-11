var Montage = require("montage").Montage,
    FreeNASService = require("core/service/freenas-service").FreeNASService,
    Model = require("core/model/model").Model;

var SystemAdvancedService = exports.SystemAdvancedService = Montage.specialize({

    _instance: {
        value: null
    },

    _dataService: {
        value: null
    },

    getSerialConsoleData: {
        value: function() {
            var consoleData = {},
                loadingPromises = [];
            loadingPromises.push(
                this._dataService.fetchData(Model.SystemAdvanced).then(function(systemAdvanced) {
                    consoleData.systemAdvanced = systemAdvanced[0];
                }),
                Model.populateObjectPrototypeForType(Model.SystemAdvanced).then(function(SystemAdvanced){
                    return SystemAdvanced.constructor.services.serialPorts();
                }).then(function(serialPorts) {
                    consoleData.serialPorts = serialPorts;
                })
            );
            return Promise.all(loadingPromises).then(function() {
                return consoleData;
            });
        }
    }


}, {
    instance: {
        get: function() {
            if(!this._instance) {
                this._instance = new SystemAdvancedService();
                this._instance._dataService = FreeNASService.instance;
            }
            return this._instance;
        }
    }
})
