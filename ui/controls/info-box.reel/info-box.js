/**
 * @module ui/info-box.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class InfoBox
 * @extends Component
 */
exports.InfoBox = Component.specialize(/** @lends InfoBox# */ {
    enterDocument: {
        value: function() {
            this.scroller.style.maxHeight = this.maxHeight + "px";
        }
    }
});
