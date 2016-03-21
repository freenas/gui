/**
 * @module ui/controls/foldable-section.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class FoldableSection
 * @extends Component
 */
exports.FoldableSection = Component.specialize(/** @lends FoldableSection# */ {
    getContentHeight: {
        value: function () {
            return this.contentContainer.offsetHeight + "px";
        }
    },

    setContentMaxHeight: {
        value:  function () {
            if (this.isExpanded) {
                this.sectionContent.style.maxHeight = this.getContentHeight();
            } else {
                this.sectionContent.style.maxHeight = 0;
            }
        }
    },

    handleExpandButtonAction: {
        value: function(event) {
            this.isExpanded = !this.isExpanded;
            this.setContentMaxHeight();
            event.stopPropagation();
        }
    }
});
