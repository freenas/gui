/**
 * @module ui/configuration.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class Configuration
 * @extends Component
 */
exports.Configuration = Component.specialize(/** @lends Configuration# */ {
    constructor: {
        value: function Configuration() {
            this.super();
        }
    }
});
