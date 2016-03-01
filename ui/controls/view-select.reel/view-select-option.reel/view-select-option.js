/**
 * @module ui/view-select-option.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class ViewSelectOption
 * @extends Component
 */
exports.ViewSelectOption = Component.specialize(/** @lends ViewSelectOption# */ {
    draw: {
        value: function () {
            this.use.setAttributeNS('http://www.w3.org/1999/xlink','href', ("#" + this.iconId));
        }
    }
});
