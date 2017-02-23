var Montage = require("montage").Montage,
    FreeNASService = require("core/service/freenas-service").FreeNASService,
    Model = require("core/model/model").Model;

var MailRepository = require("core/repository/mail-repository").MailRepository;

var MailService = exports.MailService = Montage.specialize({
    _instance: {
        value: null
    },

    _dataService: {
        value: null
    },

    sendTestMail: {
        value: function (mailMessage, mailObject) {
            return this.mailRepository.sendTestMail(mailMessage, mailObject);
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
                this._instance.mailRepository = MailRepository.getInstance();
            }
            return this._instance;
        }
    }
});
