/**
 * @module ui/mail.reel
 */
var Component = require("montage/ui/component").Component,
    Model = require("core/model/model").Model,
    MailEncryptionType = require("core/model/enumerations/mail-encryption-type").MailEncryptionType;

/**
 * @class Mail
 * @extends Component
 */
exports.Mail = Component.specialize(/** @lends Mail# */ {


    handleSendTestMailAction: {
        value: function() {
            this.application.mailService.sendTestMail({
                "from": this.object.from,
                "subject": "test mail",
                "to": this.object.to,
                "extra_headers": {},
                "message": "Yay, You've got mail",
                "attachments": []
            },{
                "server": this.object.server,
                "port": this.object.port,
                "encryption": this.object.encryption,
                "auth": this.object.auth,
                "from": this.object.from,
                "user": this.object.user,
                "pass": this.object.pass
            });
        }
    },

    enterDocument: {
        value: function(isFirstTime) {
            var self = this;
            if(isFirstTime) {
                this.isLoading = true;
                this.encryptionOptions = [];
                for (var i = 0; i < MailEncryptionType.members.length; i++) {
                    this.encryptionOptions.push({label: MailEncryptionType.members[i], value: MailEncryptionType[MailEncryptionType.members[i]]});
                };
                self.isLoading = false;
            }
        }
    },

    save: {
        value: function() {
            return this.application.mailService.saveMailData(this.object);
        }
    },

    revert: {
        value: function() {
            this.object = this._object;
        }
    },

    _snapshotDataObjectsIfNecessary: {
        value: function() {
            if (!this._object) {
                this._object = this.application.dataService.clone(this.object);
            }
        }
    }
});
