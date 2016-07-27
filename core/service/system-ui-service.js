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
            var systemUIData = {},
                loadingPromises = [];
            loadingPromises.push(
                this._dataService.fetchData(Model.SystemUi).then(function(SystemUi){
                    systemUIData.systemUI = SystemUi[0];
                })
            );
            return Promise.all(loadingPromises).then(function() {
                return systemUIData;
            });
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
