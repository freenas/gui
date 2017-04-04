/**
 * @module ui/scrollable-list.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class ScrollableList
 * @extends Component
 */
exports.ScrollableList = Component.specialize(/** @lends ScrollableList# */ {

    _height: {
        value: null
    },

    height: {
        get: function () {
            return this.height;
        },
        set: function (height) {
            if (this._height != height) {
                this.element.style.height = height + "em";
            }
        }
    }
});
