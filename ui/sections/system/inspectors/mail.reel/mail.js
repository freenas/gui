var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    MailEncryptionType = require("core/model/enumerations/mail-encryption-type").MailEncryptionType,
    _ = require("lodash");

exports.Mail = AbstractInspector.specialize(/** @lends Mail# */ {

    handlesendTestMailAction: {
        value: function() {
            this._mailService.sendTestMail();
        }
    },

    enterDocument: {
        value: function(isFirstTime) {
            var self = this;
            if(isFirstTime) {
                this.isLoading = true;
                this.encryptionOptions = [];
                this.encryptionOptions = MailEncryptionType.members.map(function(x) {
                    return {
                        label: x,
                        value: x
                    };
                });
                this._sectionService.getMailConfig().then(function(mailData) {
                    self.object = mailData.mail;
                    self._snapshotDataObjectsIfNecessary();
                });
                self.isLoading = false;
            }
        }
    },

    save: {
        value: function() {
            return this._sectionService.saveMailConfig(this.object);
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
                this._object = _.cloneDeep(this.object);
            }
        }
    }
});
