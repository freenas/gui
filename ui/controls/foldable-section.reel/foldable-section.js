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
            value = !!value;

            if (this._isExpanded !== value) {
                this._isExpanded = value;
                this.needsDraw = true;
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
                childList: true,
                attributes: true
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
            if (event.type === "attributes" && event.attributeName !== "style") {
                return void 0;
            }

            this.needsDraw = true;
        }
    },

    handleExpandButtonAction: {
        value: function(event) {
            this.isExpanded = !this.isExpanded;
            event.stopPropagation();
        }
    },

    willDraw: {
        value: function () {
            this._contentContainerHeight = this.contentContainer.offsetHeight ;
        }
    },

    draw: {
        value: function () {
            this.sectionContent.style.height = this.isExpanded ? this._contentContainerHeight + "px" : 0;
        }
    }

});
