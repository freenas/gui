/**
 * @module ui/controls/foldable-section.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class FoldableSection
 * @extends Component
 */
exports.FoldableSection = Component.specialize(/** @lends FoldableSection# */ {
    handleAction: {
        value: function(event) {
            this.isExpanded = !this.isExpanded;
            event.stopPropagation();
        }
    }
});
