var Component = require("montage/ui/component").Component;

/**
 * @class FtpService
 * @extends Component
 */
exports.FtpService = Component.specialize({
    _handleOnlyAnonChange: {
        value: function() {
            if (!this.object.only_anonymous) {
                this.object.only_local = true;
            };
        }
    },

    _handleOnlyLocalChange: {
        value: function() {
            if (!this.object.only_local) {
                this.object.only_anonymous = true;
            };
        }
    },

    enterDocument: {
        value: function() {
            this.addPathChangeListener("object.only_anonymous", this, "_handleOnlyAnonChange");
            this.addPathChangeListener("object.only_local", this, "_handleOnlyLocalChange");
        }
    },

    exitDocument: {
        value: function() {
            if (this.getPathChangeDescriptor("object.only_anonymous", this)) {
                this.removePathChangeListener("object.only_anonymous", this);   
            }
            if (this.getPathChangeDescriptor("object.only_local", this)) {
                this.removePathChangeListener("object.only_local", this);   
            }

        }
    },
});
