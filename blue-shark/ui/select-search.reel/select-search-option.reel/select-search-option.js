/**
 * @module ui/multiple-select-option.reel
 */
var Component = require("montage/ui/component").Component,
    PressComposer = require("montage/composer/press-composer").PressComposer;

/**
 * @class MultipleSelectOption
 * @extends Component
 */
exports.SelectSearchOption = Component.specialize(/** @lends MultipleSelectOption# */ {
    prepareForActivationEvents: {
        value: function() {
            var pressComposer = new PressComposer();
            this.addComposer(pressComposer);
            pressComposer.addEventListener("press", this);
            this.element.addEventListener("mouseover", this);
        }
    },

    handlePress: {
        value: function() {
            this.valueToAdd = this.option;
        }
    },

    handleMouseover: {
        value: function() {
            if (this.selected != this.option) {
                this.selected = this.option;
            }
        }
    }
});
