/**
 * @module ui/controls/foldable-section.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class FoldableSection
 * @extends Component
 */
exports.FoldableSection = Component.specialize(/** @lends FoldableSection# */ {
    _isExpanded: {
        value: null
    },

    isExpanded: {
        get: function () {
            return this._isExpanded;
        },
        set: function (value) {
            this._isExpanded = value;
            if(!this.isFirstTime) {
                this.setContentMaxHeight();
            }
        }
    },

    isFirstTime: {
        value: true
    },

    draw: {
        value: function () {
            if (this.isFirstTime) {
                this.setContentMaxHeight();
                this.isFirstTime = false;
            }
        }
    },

    enterDocument: {
        value: function (isFirstTime) {
            if (isFirstTime) {
                this._mutationObserver = new MutationObserver(this.handleMutations.bind(this));
            }

            this._mutationObserver.observe(this.element, {
                subtree: true,
                childList: true
            });
        }
    },

    exitDocument: {
        value: function () {
            this._mutationObserver.disconnect();
        }
    },

    handleMutations: {
        value: function (event) {
            this.setContentMaxHeight();
            this.needsDraw = true;
        }
    },

    getContentHeight: {
        value: function () {
            return this.contentContainer.offsetHeight + "px";
        }
    },

    setContentMaxHeight: {
        value:  function () {
            if (this.isExpanded) {
                this.sectionContent.style.height = this.getContentHeight();
            } else {
                this.sectionContent.style.height = 0;
            }
        }
    },

    handleExpandButtonAction: {
        value: function(event) {
            this.isExpanded = !this.isExpanded;
            event.stopPropagation();
        }
    }
});
