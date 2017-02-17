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
            if (this.object._isNew) {
                this.object.credentials.port = 22;
            }
        }
    }
});
