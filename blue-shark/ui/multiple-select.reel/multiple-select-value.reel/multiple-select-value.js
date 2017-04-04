/**
 * @module ui/multiple-select-value.reel
 */
var AbstractDraggableComponent = require("core/drag-drop/abstract-draggable-component").AbstractDraggableComponent,
    KeyComposer = require("montage/composer/key-composer").KeyComposer;

/**
 * @class MultipleSelectValue
 * @extends Component
 */
exports.MultipleSelectValue = AbstractDraggableComponent.specialize(/** @lends MultipleSelectValue# */ {
    converter: {
        value: null
    },

    _inputError: {
        value: null
    },

    invalidValue: {
        value: null
    },

    isGhostImageCenter: {
        value: false
    },

    placeHolderStrategy: {
        value: AbstractDraggableComponent.PLACE_HOLDER_STRATEGY.remove
    },

    prepareForActivationEvents: {
        value: function() {
            AbstractDraggableComponent.prototype.prepareForActivationEvents.call(this);

            this.valueField.delegate = {
                shouldAcceptValue: function() {
                    return true;
                }
            };

            KeyComposer.createKey(this.valueField, "escape", "undo").addEventListener("keyPress", this);
            KeyComposer.createKey(this.valueField, "enter", "save").addEventListener("keyPress", this);
        }
    },

    handleSaveKeyPress: {
        value: function() {
            var value = this.valueField.value,
                isValid = true;
            if (this.converter) {
                if (this.converter.validator && typeof this.converter.validator.validate === 'function') {
                    isValid = this.converter.validator.validate(value);
                }
                if (isValid) {
                    this.invalidValue = null;
                    if (typeof this.converter.revert === 'function') {
                        value = this.converter.revert(value);
                    }
                } else {
                    this.invalidValue = value;
                }
            }
            if (isValid) {
                this.valueField.element.blur();
                this.object = value;
            }
        }
    },

    handleUndoKeyPress: {
        value: function () {
            this.valueField.element.blur();
            this.valueField.value = this.object.label;
        }
    }

});
