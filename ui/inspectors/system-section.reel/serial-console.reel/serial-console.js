/**
 * @module ui/serial-console.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class SerialConsole
 * @extends Component
 */
exports.SerialConsole = Component.specialize(/** @lends SerialConsole# */ {
    constructor: {
        value: function SerialConsole() {
            this.super();
        }
    }
});
