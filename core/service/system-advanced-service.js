var Montage = require("montage").Montage,
    FreeNASService = require("core/service/freenas-service").FreeNASService,
    Model = require("core/model/model").Model,
    SystemDeviceService = require("core/service/system-device-service").SystemDeviceService;


var SystemAdvancedService = exports.SystemAdvancedService = Montage.specialize({

    _instance: {
        value: null
    },

    _dataService: {
        value: null
    },

    _systemDeviceService: {
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
                this._systemDeviceService.getSerialPorts().then(function(serialPorts) {
                    consoleData.serialPorts = serialPorts;
                })
            );
            return Promise.all(loadingPromises).then(function() {
                return consoleData;
            });
        }
    },

    saveAdvanceData: {
        value: function(advanceData) {
            return this._dataService.saveDataObject(advanceData);
        }
    }


}, {
    instance: {
        get: function() {
            if(!this._instance) {
                this._instance = new SystemAdvancedService();
                this._instance._dataService = FreeNASService.instance;
                this._instance._systemDeviceService = SystemDeviceService.instance;
            }
            return this._instance;
        }
    }
})
