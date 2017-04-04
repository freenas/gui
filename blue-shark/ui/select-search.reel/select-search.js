/**
 * @module ui/select-search.reel
 */
var Component = require("montage/ui/component").Component,
    KeyComposer = require("montage/composer/key-composer").KeyComposer;

/**
 * @class SelectSearch
 * @extends Component
 */
exports.SelectSearch = Component.specialize(/** @lends SelectSearch# */ {
    enabled: {
        value:  true
    },

    options: {
        value: null
    },

    isDraggable: {
        value: false
    },

    converter: {
        value: null
    },

    __selectedOption: {
        value: null
    },

    isExpanded: {
        value: false
    },

    _selectedOption: {
        get: function() {
            return this.__selectedOption;
        },
        set: function(option) {
            if (option && this.__selectedOption != option) {
                this.__selectedOption = option;
                this._selectOption(option);
            }
        }
    },

    enterDocument: {
        value: function (firstTime) {

            if (!this.values) {
                this.values = [];
            }
            if (!this.options) {
                this.options = [];
            }
        }
    },

    prepareForActivationEvents: {
        value: function() {
            this._inputField.delegate = {
                shouldAcceptValue: function() {
                    return true;
                }
            };
            KeyComposer.createKey(this._inputField, "down", "down").addEventListener("keyPress", this);
            KeyComposer.createKey(this._inputField, "up", "up").addEventListener("keyPress", this);
        }
    },

    handleButtonAction: {
        value: function () {
            this.isExpanded = !this.isExpanded;
        }
    },

    handleClearButtonAction: {
        value: function () {
            this._clearInput();
        }
    },

    _valueToAdd: {
        get: function() {
            return null;
        },
        set: function(value) {
            if (value) {
                this.value = value;
                this.isExpanded = !this.isExpanded;
            }
        }
    },

    _findCloserComponentFromElement: {
        value: function _findCloserComponentFromElement (element) {
            var component;

            while (element && !(component = element.component) && element !== this.element) {
                element = element.parentNode;
            }

            return component;
        }
    },

    _blurInputField: {
        value: function () {
            this._inputField.element.blur();
        }
    },

    handleInputAction: {
        value: function() {
            this._inputField.value = this._selectedOption.name;
            this._blurInputField();
        }
    },

    handleDownKeyPress: {
        value: function(event) {
            switch (event.target.component) {
                case this._inputField:
                    if (this.options && this.options.length > 0) {
                        this._navigateInOptions(1)
                    }
                    break;
            }
        }
    },

    handleUpKeyPress: {
        value: function(event) {
            switch (event.target.component) {
                case this._inputField:
                    if (this.options && this.options.length > 0) {
                        this._navigateInOptions(-1);
                    }
                    break;
            }
        }
    },

    _selectOption: {
        value: function (option) {
            if (!this._typedValue) {
                this._typedValue = this._inputField.value;
            }
            this._optionsController.select(option);
            this._inputField.value = this._optionsController.selection[0].label;
            this._selectedOption = option;
        }
    },

    _stopScrollingOptions: {
        value: function () {
            this._optionsController.clearSelection();
            this._selectedOption = null;
            this._inputField.value = this._typedValue;
            this._typedValue = null;
        }
    },

    _navigateInOptions: {
        value: function(distance) {
            var currentIndex = this._optionsController.organizedContent.indexOf(this._optionsController.selection[0]),
                newIndex = currentIndex + distance,
                contentLength = this._optionsController.organizedContent.length;
            if (newIndex < -1) {
                newIndex = contentLength -1;
            }
            if (newIndex == -1 || newIndex == contentLength) {
                this._inputField.value = this._typedValue;
                this._stopScrollingOptions();
            } else {
                this._selectOption(this._optionsController.organizedContent[newIndex % contentLength]);
            }
        }
    },

    _clearInput: {
        value: function() {
            this._typedValue = null;
            this._inputField.value = null;
        }
    }
});
