/**
 * @module ui/mail.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class Mail
 * @extends Component
 */
exports.Mail = Component.specialize(/** @lends Mail# */ {
    enterDocument: {
        value: function(isFirstTime) {
            var self = this;
            
            if(isFirstTime) {
                this.isLoading = true;
                this.application.mailService.getMailData().then(function(mailData) {
                    self.mailData = mailData;
                    self.object = mailData.mail;
                    console.log(self.object);
                });
                self.isLoading = false;
            }
        }
    }
});
