var Component = require("montage/ui/component").Component;

/**
 * @class CurrentUserSummary
 * @extends Component
 */
exports.CurrentUserSummary = Component.specialize({
    enterDocument: {
        value: function(isFirstTime) {
            var self = this;
            if (!this.application.session) {
                this.application.session = {
                    username: '',
                    host: ''
                };
            }
            this.session = this.application.session;
            this.now = Date.now();
            setInterval(function() {
                self.now = Date.now();
            }, 1000);
        }
    }
});
