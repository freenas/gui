var Montage = require("montage").Montage,
    FreeNASService = require("core/service/freenas-service").FreeNASService,
    Model = require("core/model/model").Model;

var SystemTimeService = exports.SystemTimeService = Montage.specialize({

    _instance: {
        value: null
    },

    _dataService: {
        value: null
    },

    getSystemTime: {
        value: function () {
            return this._dataService.fetchData(Model.SystemTime).then(function (systemTime) {
                return systemTime[0];
            })
        }
    }
}, {
    instance: {
        get: function() {
            if(!this._instance) {
                this._instance = new SystemTimeService();
                this._instance._dataService = FreeNASService.instance;
            }
            return this._instance;
        }
    }
})
