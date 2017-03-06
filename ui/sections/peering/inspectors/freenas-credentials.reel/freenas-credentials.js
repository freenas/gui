/**
 * @module ui/sections/peering/inspectors/freenas-credentials.reel
 */
var Component = require("montage/ui/component").Component,
	_ = require("lodash");
/**
 * @class FreenasCredentials
 * @extends Component
 */
exports.FreenasCredentials = Component.specialize(/** @lends FreenasCredentials# */ {
    enterDocument: {
        value: function() {
            if (this.object._isNew) {
                this.object.credentials.port = 22;
            }
        }
    }
});
