var Montage = require("montage").Montage,
    SystemGeneralRepository = require("core/repository/system-general-repository").SystemGeneralRepository,
    FreeNASService = require("core/service/freenas-service").FreeNASService,
    Model = require("core/model/model").Model;

var SystemGeneralService = exports.SystemGeneralService = Montage.specialize({

    _instance: {
        value: null
    },

    _dataService: {
        value: null
    },

    getSystemGeneral: {
        value: function() {
            return  this._repository.getSystemGeneral();
        }
    },

    getTimezoneOptions: {
        value : function() {
            return Model.populateObjectPrototypeForType(Model.SystemGeneral).then(function(SystemGeneral){
                return SystemGeneral.constructor.services.timezones();
            });
        }
    },

    getKeymapOptions: {
        value: function() {
            return Model.populateObjectPrototypeForType(Model.SystemGeneral).then(function(SystemGeneral){
                return SystemGeneral.constructor.services.keymaps();
            });
        }
    },

    getKeymapsData: {
        value: function() {
            var keymapsData = {},
                loadingPromises = [];
            loadingPromises.push(
                this._dataService.fetchData(Model.SystemGeneral).then(function(systemGeneral){
                    keymapsData.console_keymap = systemGeneral[0];
                }),
                Model.populateObjectPrototypeForType(Model.SystemGeneral).then(function(SystemGeneral){
                    return SystemGeneral.constructor.services.keymaps();
                }).then(function(keymaps){
                    keymapsData.keymapsOptions = keymaps;
                })
            );
            return Promise.all(loadingPromises).then(function() {
                return keymapsData;
            });
        }
    },

    saveGeneralData: {
        value: function(generalObject) {
            return this._dataService.saveDataObject(generalObject);
        }
    }

}, {
    instance: {
        get: function() {
            if(!this._instance) {
                this._instance = new SystemGeneralService();
                this._instance._repository = SystemGeneralRepository.getInstance();
                this._instance._dataService = FreeNASService.instance;
            }
            return this._instance;
        }
    }
});
