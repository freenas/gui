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

    sendTestMail: {
        value: function (mailMessage,mailObject) {
            return Model.populateObjectPrototypeForType(Model.AlertEmitterEmail).then(function(Mail){
                return Mail.constructor.services.send(mailMessage,mailObject);
            });
        }
    },

    getMailData: {
        value: function() {
            var mailData = {},
                loadingPromises = [];
            loadingPromises.push(
                this._dataService.fetchData(Model.AlertEmitterEmail).then(function(Mail) {
                    mailData.mail = Mail[0];
                })
            );
            return Promise.all(loadingPromises).then(function() {
                return mailData;
            });
        }
    },

    saveMailData: {
        value: function(mailData) {
            return this._dataService.saveDataObject(mailData);
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
