/**
 * @module ui/field-search.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class FieldSearch
 * @extends Component
 */
exports.FieldSearch = Component.specialize({

    enterDocument: {
        value: function () {
            if (!this.displayedValue) {
                this.displayedValue = this.value;
            }
        }
    }

});
