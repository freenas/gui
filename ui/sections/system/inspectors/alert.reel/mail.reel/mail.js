/**
 * @module ui/mail.reel
 */
var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    Component = require("montage/ui/component").Component,
    Model = require("core/model/model").Model,
    MailEncryptionType = require("core/model/enumerations/mail-encryption-type").MailEncryptionType;

/**
 * @class Mail
 * @extends Component
 */
exports.Mail = AbstractInspector.specialize(/** @lends Mail# */ {

    handleSendTestMailAction: {
        value: function() {
            this.application.mailService.sendTestMail({
                "from_address": this.alertEmitterEmail.config.from_address,
                "subject": "test mail",
                "to": this.alertEmitterEmail.config.to,
                "extra_headers": {},
                "message": "Yay, You've got mail",
                "attachments": []
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
                for (var i = 0; i < MailEncryptionType.members.length; i++) {
                    this.encryptionOptions.push({label: MailEncryptionType.members[i], value: MailEncryptionType[MailEncryptionType.members[i]]});
                };
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
