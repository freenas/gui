/**
 * @module ui/mail.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class Mail
 * @extends Component
 */
exports.Mail = Component.specialize(/** @lends Mail# */ {

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
                this.application.mailService.getMailData().then(function(mailData) {
                    self.object = mailData.mail;
                });
                self.isLoading = false;
            }
        }
    },

    save: {
        value: function() {
            return this.application.mailService.saveMailData(this.object);
        }
    }
});
