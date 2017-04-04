/**
 * @module ui/select-filter.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class SelectFilter
 * @extends Component
 */
exports.SelectFilter = Component.specialize(/** @lends SelectFilter# */ {

    handleDisplayAllButtonAction: {
        value: function () {
            this.options.forEach(function(filter){
                filter.checked = true;
            });
        }
    },

    handleFilterButtonAction: {
        value: function () {
            this._toggleFilterOverlay();
        }
    },

    _toggleFilterOverlay: {
        value: function () {
            this.filterOverlayComponent.isShown ? this.filterOverlayComponent.hide() : this.filterOverlayComponent.show();
        }
    }
});
