/**
 * @module ui/text-input-edit.reel
 */
var AbstractControl = require("montage/ui/base/abstract-control").AbstractControl,
    KeyComposer = require("montage/composer/key-composer").KeyComposer;

/**
 * @class TextInputEdit
 * @extends Component
 */
var TextInputEdit = exports.TextInputEdit = AbstractControl.specialize(/** @lends TextInputEdit# */ {

    prepareForActivationEvents: {
        value: function () {
            var keyboardIdentifiers = this.constructor.KEY_IDENTIFIERS,
                keyboardIdentifier;

            this._keyComposerMap = new Map();

            for (var i = 0, length = keyboardIdentifiers.length; i < length; i++) {
                keyboardIdentifier = keyboardIdentifiers[i];

                this._keyComposerMap.set(
                    keyboardIdentifier,
                    KeyComposer.createKey(this, keyboardIdentifier, keyboardIdentifier)
                );

                this._keyComposerMap.get(keyboardIdentifier).addEventListener("keyPress", this);
            }
        }
    },

    _originalValue: {
        value: null
    },

    isEditEnabled: {
        value: false
    },

    _deselectText: {
        value: function () {
            this.input.element.selectionEnd = this.input.element.selectionStart;
        }
    },

    handleEditButtonAction: {
        value: function () {
            this.isEditEnabled = true;
            this._originalValue = this.input.value;
            this.input.focus();
            this.input.select();
        }
    },

    handleSubmitButtonAction: {
        value: function () {
            this.isEditEnabled = false;
            this._deselectText();
            if(this._originalValue != this.input.value) {
                this.detail.set('eventName', 'textValueChanged');
                this.dispatchActionEvent();
            }
        }
    },

    handleCancelButtonAction: {
        value: function () {
            this.input.value = this._originalValue;
            this.isEditEnabled = false;
            this._deselectText();
        }
    }
},
{

    KEY_IDENTIFIERS: {
        value: [
            "enter",
            "escape"
        ]
    }
});

TextInputEdit.prototype.handleEnterKeyPress = TextInputEdit.prototype.handleSubmitButtonAction;
TextInputEdit.prototype.handleEscapeKeyPress = TextInputEdit.prototype.handleCancelButtonAction;

