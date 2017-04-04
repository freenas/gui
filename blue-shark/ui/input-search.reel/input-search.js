/**
 * @module ui/input-search.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class InputSearch
 * @extends Component
 */
exports.InputSearch = Component.specialize(/** @lends InputSearch# */ {
    enabled: {
        value: true
    },

    handleClearButtonAction: {
        value: function () {
            this._searchField.value = null;
        }
    }
});
