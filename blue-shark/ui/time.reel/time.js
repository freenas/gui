/**
 * @module ui/time.reel
 */
var Component = require("montage/ui/component").Component,
    KeyComposer = require("montage/composer/key-composer").KeyComposer;

/**
 * @class Time
 * @extends Component
 */
exports.Time = Component.specialize(/** @lends Time# */ {
    __selectedOption: {
        value: null
    },

    _selectedOption: {
        get: function() {
            return this.__selectedOption;
        },
        set: function(option) {
            if (this.__selectedOption != option) {
                if (option) {
                    this.__selectedOption = option;
                    this._optionsController.select(option);
                    this.value = option;
                } else {
                    this._optionsController.clearSelection();
                }
            }
        }
    },

    enterDocument: {
        value: function() {
            if (!this.options) {
                this.options = [];
                if (this.intervalInSeconds) {
                    var maxValue = new Date(0, 0, 0, 23, 59, 59),
                        seconds = 0,
                        nextOption = new Date(0, 0, 0, 0, 0, seconds);
                    while (nextOption <= maxValue) {
                        this.options.push(nextOption);
                        seconds += this.intervalInSeconds;
                        nextOption = new Date(0, 0, 0, 0, 0, seconds);
                    }
                }
            }
            if (this.isDefaultNow) {
                this.options.unshift(new Date());
            }
            if (!this.allowEmpty && !this.value) {
                this._selectedOption = this.options[0];
            }

            this.addPathChangeListener("value", this, "_handleValueChange");
        }
    },

    exitDocument: {
        value: function() {
            if (this.getPathChangeDescriptor("value", this)) {
                this.removePathChangeListener("value", this);
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

    handleInputAction: {
        value: function() {
            if (this._inputField.value) {
                this.value = this._inputField.value;
                this._selectedOption = this._findMatchingOption();
                this._blurInputField();
            }
        }
    },

    handleDownKeyPress: {
        value: function(event) {
            this._handleDirectionKeyPress(event, 1);
        }
    },

    handleUpKeyPress: {
        value: function(event) {
            this._handleDirectionKeyPress(event, -1);
        }
    },

    _handleDirectionKeyPress: {
        value: function(event, direction) {
            if (event.target.component === this._inputField && this.options && this.options.length > 0) {
                this._navigateInOptions(direction);
            }
        }
    },

    _handleValueChange: {
        value: function() {
            if (this.value) {
                this._selectedOption = this._findMatchingOption();
                this._nextOptionComponent = this._findNextMatchingIndex();
            }
        }
    },

    _blurInputField: {
        value: function () {
            this._inputField.element.blur();
        }
    },

    _findMatchingOption: {
        value: function() {
            var i, length, option;
            for (i = 0, length = this.options.length; i < length; i++) {
                option = this.options[i];
                if (option === this.value) {
                    return option;
                }
            }
            return null;
        }
    },

    _findNextMatchingIndex: {
        value: function() {
            var option = this._findNextOption();
            return this.options.indexOf(option);
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
            if (distance > 0) {
                this._selectedOption = this._findNextOption();
            } else {
                this._selectedOption = this._findPreviousOption();
            }
        }
    },

    _findPreviousOption: {
        value: function() {
            var option,
                i = 0,
                length = this.options.length;
            for (; i < length; i++) {
                option = this.options[i];
                if (option.getHours() > this.value.getHours() || 
                    option.getHours() === this.value.getHours() && option.getMinutes() >= this.value.getMinutes()) {
                    break;
                }
            }
            if (i === 0) {
                i = this.options.length;
            }
            return this.options[i-1];
        }
    },

    _findNextOption: {
        value: function() {
            var option,
                max = this.options.length - 1,
                i = max;
            for (; i >= 0; i--) {
                option = this.options[i];
                if (option.getHours() < this.value.getHours() ||
                    option.getHours() === this.value.getHours() && option.getMinutes() <= this.value.getMinutes()) {
                    break;
                }
            }
            if (i === max) {
                i = -1;
            }
            return this.options[i+1];
        }
    },

    handleIncrementAction: {
        value: function (e) {
            this._navigateInOptions(1);
        }
    },

    handleDecrementAction: {
        value: function (e) {
            this._navigateInOptions(-1);
        }
    }
});

