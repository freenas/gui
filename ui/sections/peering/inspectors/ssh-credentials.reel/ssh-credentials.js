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
            this.object.credentials = {};
            this.object.credentials['%type'] = this.object.type + '-credentials';
        }
    },

    exitDocument: {
        value: function() {
            this.object.credentials.password = null;
        }
    }
});
