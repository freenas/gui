var Montage = require("montage").Montage,
    FreeNASService = require("core/service/freenas-service").FreeNASService,
    Model = require("core/model/model").Model;

var SystemGeneralService = exports.SystemGeneralService = Montage.specialize({

    _instance: {
        value: null
    },

    _dataService: {
        value: null
    },

    getTimezoneData: {
        value: function() {
            var timezoneData = {},
                loadingPromises = [];
            loadingPromises.push(
                this._dataService.fetchData(Model.SystemGeneral).then(function(systemGeneral){
                    timezoneData.timezone = systemGeneral[0].timezone;
                }),
                Model.populateObjectPrototypeForType(Model.SystemGeneral).then(function(SystemGeneral){
                    return SystemGeneral.constructor.services.timezones();
                }).then(function(timezones){
                    timezoneData.timezoneOptions = timezones;
                })
            );
            return Promise.all(loadingPromises).then(function() {
                return timezoneData;
            });
        }
    },

    getKeymapsData: {
        value: function() {
            var keymapsData = {},
                loadingPromises = [];
            loadingPromises.push(
                this._dataService.fetchData(Model.SystemGeneral).then(function(systemGeneral){
                    keymapsData.console_keymap = systemGeneral[0].console_keymap;
                }),
                Model.populateObjectPrototypeForType(Model.SystemGeneral).then(function(SystemGeneral){
                    return SystemGeneral.constructor.services.keymaps();
                }).then(function(keymaps){
                    keymapsData.keymapsOptions = keymaps;
                })
            );
            return Promise.all(loadingPromises).then(function() {
                return keymapsData;
            })
        }
    }
}, {
    instance: {
        get: function() {
            if(!this._instance) {
                this._instance = new SystemGeneralService();
                this._instance._dataService = FreeNASService.instance;
            }
            return this._instance;
        }
    }
});
