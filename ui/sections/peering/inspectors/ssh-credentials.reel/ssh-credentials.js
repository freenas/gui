/**
 * @module ui/sections/peering/inspectors/ssh-credentials.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class SshCredentials
 * @extends Component
 */
exports.SshCredentials = Component.specialize(/** @lends SshCredentials# */ {
    enterDocument: {
        value: function() {
            this.password = this.object.password;
        }
    },

    exitDocument: {
        value: function() {
            this.password = null;
        }
    },

    save: {
        value: function() {
            if (this.password) {
                this.object.password = this.password;
            }
        }
    }     
});
