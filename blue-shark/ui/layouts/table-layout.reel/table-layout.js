/**
 * @module ui/table.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class TableLayout
 * @extends Component
 */
exports.TableLayout = Component.specialize({
    enterDocument: {
        value: function () {
            if (!!this.contentMaxHeight) {
                this.scrollview.style.maxHeight = this.contentMaxHeight + "em";
            }
        }
    }
});
