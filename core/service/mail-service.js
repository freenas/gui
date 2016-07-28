var Montage = require("montage").Montage,
    FreeNASService = require("core/service/freenas-service").FreeNASService,
    Model = require("core/model/model").Model;

var MailService = exports.MailService = Montage.specialize({
    _instance: {
        value: null
    },

    _dataService: {
        value: null
    },

    getMailData: {
        value: function() {
            var mailData = {},
                loadingPromises = [];
            loadingPromises.push(
                this._dataService.fetchData(Model.Mail).then(function(Mail) {
                    mailData.mail = Mail[0];
                })
            );
            return Promise.all(loadingPromises).then(function() {
                return mailData;
            });
        }
    }
}, {
    instance: {
        get: function() {
            if(!this._instance) {
                this._instance = new MailService();
                this._instance._dataService = FreeNASService.instance;
            }
            return this._instance;
        }
    }
});
