var Montage = require("montage").Montage,
    FreeNASService = require("core/service/freenas-service").FreeNASService,
    Model = require("core/model/model").Model;

var SystemUIService = exports.SystemUIService = Montage.specialize({
    _instance: {
        value: null
    },

    _dataService: {
        value: null
    },

    getUIData: {
        value: function() {
            return  this._dataService.fetchData(Model.SystemUi).then(function(systemUi){
                        return systemUi[0];
                    });
        }
    },

    saveUIData: {
        value: function(uiData) {
            return this._dataService.saveDataObject(uiData);
        }
    }

}, {
    instance: {
        get: function() {
            if(!this._instance) {
                this._instance = new SystemUIService();
                this._instance._dataService = FreeNASService.instance;
            }
            return this._instance;
        }
    }
});
