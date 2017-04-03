/**
 * @module ui/color-swatch.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class ColorSwatch
 * @extends Component
 */
exports.ColorSwatch = Component.specialize(/** @lends ColorSwatch# */ {
    enterDocument: {
        value: function () {
            this.color.classList.add('bg' + this.object.variable.slice(1));
        }
    }
});
