/**
 * @module ui/select.reel
 */
var Component = require("montage/ui/component").Component,
    KeyComposer = require("montage/composer/key-composer").KeyComposer,
    SelectOptions = require("blue-shark/ui/select.reel/select-options.reel").SelectOptions;


/**
 * @class Select
 * @extends Component
 */
var Select = exports.Select = Component.specialize({

    converter: {
        value: null
    },

    optionsOverlayComponent: {
        value: null
    },

    _options: {
        value: null
    },

    __highlightedOption: {
        value: null
    },

    _highlightedOption: {
        get: function () {
            return this.__highlightedOption;
        },
        set: function (option) {
            if (option !== this.__highlightedOption) {
                if (this.__highlightedOption) {
                    this.__highlightedOption._childComponents[0].classList.remove("highlighted");
                }

                if (option) {
                    option._childComponents[0].classList.add("highlighted");
                    this.__highlightedOption = option;
                } else {
                    this.__highlightedOption = null;
                }
            }
        }
    },

    options: {
        set: function (content) {
            this._originalContent = content;
        },
        get: function () {
            return this._options;
        }
    },

    _originalContent: {
        value: null
    },

    __selectedValue: {
        value: null
    },

    _selectedValue: {
        set: function (_selectedValue) {
            this.__selectedValue = _selectedValue;
            this.dispatchOwnPropertyChange("selectedValue", this.selectedValue, false);
        },
        get: function () {
            return this.__selectedValue;
        }
    },

    selectedValue: {
        set: function (selectedValue) {
            this.__selectedValue = this._hasOptionalValue && selectedValue === null ? NONE_OPTION_VALUE : selectedValue;
            this.dispatchOwnPropertyChange("_selectedValue", selectedValue, false);
        },
        get: function () {
            return this._hasOptionalValue && this.__selectedValue === NONE_OPTION_VALUE ? null : this._selectedValue;
        }
    },

    _hasOptionalValue: {
        value: false
    },

    hasOptionalValue: {
        set: function (hasOptionalValue) {
            hasOptionalValue = !!hasOptionalValue;
            if (hasOptionalValue !== this._hasOptionalValue) {
                this._hasOptionalValue = hasOptionalValue;
                this._updateOptionsIfNeeded();
            }
        },
        get: function () {
            return this._hasOptionalValue;
        }
    },

    enterDocument: {
        value: function (isFirstTime) {
            if (isFirstTime) {
                this.addRangeAtPathChangeListener("_originalContent", this, "_handleOriginalContentChange");
            }
        }
    },

    prepareForActivationEvents: {
        value: function () {
            var keyboardIdentifiers = this.constructor.KEY_IDENTIFIERS,
                keyboardIdentifiersKeys = Object.keys(keyboardIdentifiers),
                keyboardIdentifier;

            this._keyComposerMap = new Map();

            for (var i = 0, length = keyboardIdentifiersKeys.length; i < length; i++) {
                keyboardIdentifier = keyboardIdentifiers[keyboardIdentifiersKeys[i]];

                this._keyComposerMap.set(
                    keyboardIdentifier,
                    KeyComposer.createKey(this, keyboardIdentifier, keyboardIdentifier)
                );

                this._keyComposerMap.get(keyboardIdentifier).addEventListener("keyPress", this);
            }
        }
    },

    handleKeyPress: {
        value: function (event) {
            var keyIdentifiers = this.constructor.KEY_IDENTIFIERS;

            if (event.identifier ===  keyIdentifiers.tab && this.optionsOverlayComponent.isShown) {
                event.preventDefault();
            }
        }
    },

    _toggleOptionsOverlay: {
        value: function () {
            this.element.focus();
            this.optionsOverlayComponent.isShown ? this._hideOptionsOverlay() : this._showOptionsOverlay();
        }
    },

    _showOptionsOverlay: {
        value: function () {
            if (!this.disabled) {
                this.optionsOverlayComponent.element.focus();

                if (!this.optionsOverlayComponent.isShown) {
                    this.optionsOverlayComponent.show();
                    this._highlightedOption = this.optionsOverlayComponent.templateObjects.options.selectedIterations[0];
                }
                this.optionsOverlayComponent.element.addEventListener("mouseover", this);
                this.optionsOverlayComponent.element.addEventListener("mouseup", this);
            }
        }
    },

    _hasHighlightedOptionChanged: {
        value: function () {
            return (this.optionsOverlayComponent.isShown && this._highlightedOption == this.optionsOverlayComponent.templateObjects.options.selectedIterations[0]);
        }
    },

    handleMouseup: {
        value: function() {
            this._hasHighlightedOptionChanged() ? this._toggleOptionsOverlay() : this._selectOption();
        }
    },

    _hideOptionsOverlay: {
        value: function () {
            if (this.optionsOverlayComponent.isShown) {
                this.optionsOverlayComponent.hide();
            }
            this.optionsOverlayComponent.element.removeEventListener("mouseover", this);
            this.optionsOverlayComponent.element.removeEventListener("mouseup", this);
        }
    },

    _handleOriginalContentChange: {
        value: function() {
            var options = null;

            if (this._originalContent) {
                if (this.converter) {
                    options = this.converter.convert(this._originalContent);
                } else {
                    var isConverterMissing = false;
                    options = this._originalContent.map(function(x) {
                        if (typeof x === 'string') {
                            isConverterMissing = true;
                            return {
                                label: x,
                                value: x
                            };
                        }
                        return x;
                    });
                    if (isConverterMissing) {
                        console.warn('Usage of strings array in select component is deprecated, please use a converter instead.');
                    }
                }

                var indexNoneOption = options.indexOf(NONE_SELECT_OPTION);

                if (this._hasOptionalValue && indexNoneOption === -1) { // missing
                    options.unshift(NONE_SELECT_OPTION)

                } else if (!this._hasOptionalValue && indexNoneOption > -1) { //
                    options.splice(indexNoneOption, 1)
                }
            }

            this._options = options;
        }
    },

    _updateOptionsIfNeeded: {
        value: function () {
            if (this._options) {
                this.options = this._originalContent; // trigger setter.
            }
        }
    },

    _nextOption: {
        value: function (event) {
            if (this._options && this._options.length > 0) {
                this._navigateInOptions(1);
            }
        }
    },

    _previousOption: {
        value: function () {
            if (this._options && this._options.length > 0) {
                this._navigateInOptions(-1);
            }
        }
    },

    _selectOption: {
        value: function (e) {
            if (this.optionsOverlayComponent.isShown && this._highlightedOption) {
                this.optionsOverlayComponent.templateObjects.options.selection = [this._highlightedOption.object];
            }
        }
    },

    _navigateInOptions: {
        value: function(distance) {
            var currentIndex = this.optionsOverlayComponent.templateObjects.options.iterations.indexOf(this._highlightedOption),
                newIndex = currentIndex + distance,
                contentLength = this.optionsOverlayComponent.templateObjects.options.iterations.length;

            if (newIndex < -1) {
                newIndex = contentLength -1;
            }
            if (newIndex != -1 && newIndex != contentLength) {
                this._highlightedOption = this.optionsOverlayComponent.templateObjects.options.iterations[newIndex % contentLength];
            }
        }
    },

    _handledUpKeyPress: {
        value: function (e) {
            if (!this.optionsOverlayComponent.isShown) {
                this._toggleOptionsOverlay();
            } else {
                this._previousOption();
                e.preventDefault();
            }
        }
    },

    _handleDownKeyPress: {
        value: function (e) {
            if (!this.optionsOverlayComponent.isShown) {
                this._toggleOptionsOverlay();
            } else {
                this._nextOption();
                e.preventDefault();
            }
        }
    },

    _handleSpaceKeyPress: {
        value: function () {
            if (!this.optionsOverlayComponent.isShown || this._highlightedOption == this.optionsOverlayComponent.templateObjects.options.selectedIterations[0]) {
                this._toggleOptionsOverlay();
            } else {
                this._selectOption();
            }
        }
    },

    handleMouseover: {
        value: function(event) {
            if (event.target.component) {
                var target = event.target.component.iteration;

                if (target !== this._highlightedOption) {
                    this._highlightedOption = target;
                }
            }
        }
    },

    _handleEnterKeyPress: {
        value: function () {
            this._hasHighlightedOptionChanged() ? this._toggleOptionsOverlay() : this._selectOption();
        }
    }

}, {

    KEY_IDENTIFIERS: {
        value: {
            space: "space",
            enter: "enter",
            up: "up",
            down: "down",
            tab: "tab"
        }
    }
});


Select.prototype.handleSpaceKeyPress = Select.prototype._handleSpaceKeyPress;
Select.prototype.handleUpKeyPress = Select.prototype._handledUpKeyPress;
Select.prototype.handleDownKeyPress = Select.prototype._handleDownKeyPress;
Select.prototype.handleSelectButtonAction = Select.prototype._toggleOptionsOverlay;
Select.prototype.handleEnterKeyPress = Select.prototype._handleEnterKeyPress;
Select.prototype.exitDocument = Select.prototype._hideOptionsOverlay;


var NONE_OPTION_LABEL = "none",
    NONE_OPTION_VALUE = "_none",
    NONE_SELECT_OPTION = {label: NONE_OPTION_LABEL, value: NONE_OPTION_VALUE};
