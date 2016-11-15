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

    getSystemAdvanced: {
        value: function() {
            return this._dataService.fetchData(Model.SystemAdvanced).then(function(systemAdvanced) {
                return systemAdvanced[0];
            });
        }
    },

    getDebugCollectAddress: {
        value: function(){
            return Model.populateObjectPrototypeForType(Model.Task).then(function (Task) {
                return Task.constructor.services.submitWithDownload("debug.collect", ["freenasdebug.tar.gz"]);
            })
        }
    },

    restoreSettingsFromFileUpload: {
        value: function (configFile) {
            return Model.populateObjectPrototypeForType(Model.Task).then(function (Task) {
                return Task.constructor.services.submitWithEnv("database.restore", [[configFile]]);
            })
        }
    },

    restoreFactorySettings: {
        value: function () {
            return Model.populateObjectPrototypeForType(Model.Task).then(function (Task) {
                return Task.constructor.services.submit("database.factory_restore", []);
            })
        }
    },

    getConfigFileAddress: {
        value: function () {
            return Model.populateObjectPrototypeForType(Model.Task).then(function (Task) {
                return Task.constructor.services.submitWithDownload("database.dump",  ["freenas10.db"]);
            })
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
