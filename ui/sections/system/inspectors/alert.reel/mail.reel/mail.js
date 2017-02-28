var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    MailEncryptionType = require("core/model/enumerations/MailEncryptionType").MailEncryptionType;

exports.Mail = AbstractInspector.specialize(/** @lends Mail# */ {

    handleSendTestMailAction: {
        value: function() {
            this._sectionService.sendEmail({
                "from_address": this.alertEmitterEmail.config.from_address,
                "subject": "test mail",
                "to": this.alertEmitterEmail.config.to,
                "extra_headers": {},
                "message": "Yay, You've got mail",
                "attachments": []
            },{
                "server": this.alertEmitterEmail.config.server,
                "port": this.alertEmitterEmail.config.port,
                "encryption": this.alertEmitterEmail.config.encryption,
                "auth": this.alertEmitterEmail.config.auth,
                "from": this.alertEmitterEmail.config.from,
                "user": this.alertEmitterEmail.config.user,
                "pass": this.alertEmitterEmail.config.pass
            });
        }
    },

    enterDocument: {
        value: function(isFirstTime) {
            var self = this;
            if(isFirstTime) {
                this.isLoading = true;
                this.encryptionOptions = [];
                this.pushbullet = {};
                var cleanupEnumeration = this.cleanupEnumeration(MailEncryptionType);
                for (var i = 0; i < cleanupEnumeration.length; i++) {
                    this.encryptionOptions.push({label: cleanupEnumeration[i], value: cleanupEnumeration});
                }
                this._sectionService.getAlertEmitterEmail().then(function(alertEmitterEmail) {
                    self.alertEmitterEmail = alertEmitterEmail;
                    if (!alertEmitterEmail.config.to) {
                        self.alertEmitterEmail.config.to = [];
                    }
                });
                this._sectionService.getAlertEmitterPushBullet().then(function (pushbullet) {
                    self.pushbullet = pushbullet;
                });
                self.isLoading = false;
            }
        }
    },

    save: {
        value: function() {
            return Promise.all([
                this._sectionService.saveAlertEmitter(this.alertEmitterEmail),
                this._sectionService.saveAlertEmitter(this.pushbullet)
            ]);
        }
    },

    revert: {
        value: function() {
            this.alertEmitterEmail = this._alertEmitterEmail;
        }
    },

    _snapshotDataObjectsIfNecessary: {
        value: function() {
            if (!this._alertEmitterEmail) {
                this._alertEmitterEmail = this.application.dataService.clone(this.alertEmitterEmail);
            }
        }
    }
});
