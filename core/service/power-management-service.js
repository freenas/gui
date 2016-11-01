var Montage = require("montage").Montage,
    FreeNASService = require("core/service/freenas-service").FreeNASService,
    Model = require("core/model/model").Model;

var PowerManagementService = exports.PowerManagementService = Montage.specialize({
    _instance: {
        value: null
    },

    _dataService: {
        value: null
    },

    listDrivers: {
        value: function () {
            return Model.populateObjectPrototypeForType(Model.ServiceUps).then(function (ServiceUps) {
                return ServiceUps.constructor.services.drivers();
            });
        }
    },

    listUsbDevices: {
        value: function () {
            return Model.populateObjectPrototypeForType(Model.ServiceUps).then(function (ServiceUps) {
                return ServiceUps.constructor.services.getUsbDevices();
            })
        }
    }
}, {
    instance: {
        get: function() {
            if(!this._instance) {
                this._instance = new PowerManagementService();
                this._instance._dataService = FreeNASService.instance;
            }
            return this._instance;
        }
    }
});
