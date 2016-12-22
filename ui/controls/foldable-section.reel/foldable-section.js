/**
 * @module ui/controls/foldable-section.reel
 */
var Component = require("montage/ui/component").Component,
    AbstractComponentActionDelegate = require("ui/abstract/abstract-component-action-delegate").AbstractComponentActionDelegate,
    KeyComposer = require("montage/composer/key-composer").KeyComposer;

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

    _toggleSection: {
        value: function(event) {
            if(!this.isExpanded) {
                this.sectionContent.style.display = "block";
            }
            this.isExpanded = !this.isExpanded;
            event.stopPropagation();
        }
    },

    templateDidLoad: {
        value: function () {
            this._mutationObserver = new MutationObserver(this.handleMutations.bind(this));
        }
    },

    enterDocument: {
        value: function (isFirstTime) {
            AbstractComponentActionDelegate.prototype.enterDocument.call(this, isFirstTime);

            if (isFirstTime) {
                this.element.addEventListener("transitionend", this, false);
            }

            this._mutationObserver.observe(this.element, {
                subtree: true,
                childList: true,
                attributes: true
            });

            if (this.isExpanded) {
                this.sectionContent.style.display = "block";
            }
        }
    },

    handleTransitionend: {
        value: function (event) {
            if (event.target == this.sectionContent) {
                if (!this.isExpanded) {
                    this.sectionContent.style.display = "none";
                }
            }
        }
    },

    prepareForActivationEvents: {
        value: function() {
            KeyComposer.createKey(this, "enter", "enter").addEventListener("keyPress", this);
            KeyComposer.createKey(this, "space", "space").addEventListener("keyPress", this);
        }
    },

    handleEnterKeyPress: {
        value: function(event) {
            if(document.activeElement == this.expandButton) {
                this._toggleSection(event);
            }
        }
    },

    handleSpaceKeyPress: {
        value: function(event) {
            if(document.activeElement == this.expandButton) {
                this._toggleSection(event);
            }
        }
    },

    exitDocument: {
        value: function () {
            AbstractComponentActionDelegate.prototype.exitDocument.call(this);
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
            this._toggleSection(event);
        }
    },

    willDraw: {
        value: function () {
            this._contentContainerHeight = this.contentContainer.offsetHeight;
        }
    },

    draw: {
        value: function () {
            if (this.isExpanded && this._contentContainerHeight != 0) {
                this.sectionContent.style.height = this._contentContainerHeight + "px";
            } else if (!this.isExpanded) {
                this.sectionContent.style.height = "0px";
            }
        }
    }

});
