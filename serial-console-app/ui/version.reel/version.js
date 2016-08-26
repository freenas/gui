/**
 * @module ui/version.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class Version
 * @extends Component
 */
exports.Version = Component.specialize(/** @lends Version# */ {
    constructor: {
        value: function Version() {
            this.super();
        }
    },

    montageDescription: {
        get: function() {
            return ( typeof montageRequire !== "undefined" ? montageRequire : mr).packageDescription;
        }
    }
});
