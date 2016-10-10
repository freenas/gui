var Montage = require("montage").Montage,
    FreeNASService = require("core/service/freenas-service").FreeNASService,
    Model = require("core/model/model").Model;

var CryptoCertificateService = exports.CryptoCertificateService = Montage.specialize({

    _instance: {
        value: null
    },

    _dataService: {
        value: null
    },

    listCertificates: {
        value: function () {
            return this._dataService.fetchData(Model.CryptoCertificate).then(function (certificates) {
                return certificates;
            })
        }
    }
}, {
    instance: {
        get: function() {
            if(!this._instance) {
                this._instance = new CryptoCertificateService();
                this._instance._dataService = FreeNASService.instance;
            }
            return this._instance;
        }
    }
})
