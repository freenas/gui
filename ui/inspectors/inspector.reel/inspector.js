/**
 * @module ui/inspector.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class Inspector
 * @extends Component
 */
exports.Inspector = Component.specialize(/** @lends Inspector# */ {
    constructor: {
        value: function Inspector() {
            this.super();
        }
    }
});
