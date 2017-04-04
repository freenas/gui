var Component = require("montage/ui/component").Component;

exports.SelectMultiple = Component.specialize({

    enterDocument: {
        value: function (isFirstTime) {
            if (isFirstTime) {
                this._element.addEventListener("change", this, false);
            }
        }
    },

    allowMultiple: {
        value: true
    },

    handleChange: {
        value: function () {
            var children = this._element.children,
                selectedMap = new Map(),
                i;

            if (this._selectedValues) {
                for (i = 0; i < this._selectedValues.length; i++) {
                    selectedMap.set(this._selectedValues[i], true);
                }
            } else {
                this.selectedValues = [];
            }
            for (i = 0; i < children.length; i++) {
                if (children[i].selected) {
                    if (!selectedMap.has(this._options[i][this._valuePropertyName] || this._options[i])) {
                        this.selectedValues.push(this._options[i][this._valuePropertyName] || this._options[i]);
                    }
                } else {
                    if (selectedMap.has(this._options[i][this._valuePropertyName] || this._options[i])) {
                        this.selectedValues.splice(
                            this.selectedValues.indexOf(this._options[i][this._valuePropertyName] || this._options[i]),
                            1
                        );
                    }
                }
            }
        }
    },

    _options: {
        value: null
    },

    options: {
        get: function () {
            return this._options;
        },
        set: function (value) {
            if (this._options !== value) {
                if (this._cancelOptionsRangeChangeListener) {
                    this._cancelOptionsRangeChangeListener();
                }
                if (value && value instanceof Array) {
                    this._options = value;
                } else {
                    this._options = [];
                }
                this._cancelOptionsRangeChangeListener = this.addRangeAtPathChangeListener(
                    "_options",
                    this,
                    "handleRangeChange"
                );
                this._needsUpdateOptions = true;
                this._selectedValues = [];
                this.needsDraw = true;
            }
        }
    },

    _needsUpdateOptions: {
        value: false
    },

    _labelPropertyName: {
        value: "label"
    },

    labelPropertyName: {
        get: function () {
            return this._labelPropertyName;
        },
        set: function (value) {
            if (this._labelPropertyName !== value) {
                if (value) {
                    this._labelPropertyName = value + "";
                } else {
                    this._labelPropertyName = "label";
                }
                this._needsUpdateOptions = true;
                this.needsDraw = true;
            }
        }
    },

    _valuePropertyName: {
        value: "value"
    },

    valuePropertyName: {
        get: function () {
            return this._valuePropertyName;
        },
        set: function (value) {
            if (this._valuePropertyName !== value) {
                if (value) {
                    this._valuePropertyName = value + "";
                } else {
                    this._valuePropertyName = "value";
                }
                this._needsUpdateOptions = true;
                this.needsDraw = true;
            }
        }
    },

    _selectedValues: {
        value: null
    },

    selectedValues: {
        get: function () {
            if (!this._selectedValues) {
                this._selectedValues = [];
            }
            return this._selectedValues;
        },
        set: function (value) {
            if (this._selectedValues !== value) {
                if (this._cancelSelectedValuesRangeChangeListener) {
                    this._cancelSelectedValuesRangeChangeListener();
                }
                if (value && value instanceof Array) {
                    this._selectedValues = value;
                } else {
                    this._selectedValues = [];
                }
                this._cancelSelectedValuesRangeChangeListener = this.addRangeAtPathChangeListener(
                    "_selectedValues",
                    this,
                    "handleRangeChange"
                );
                this._needsUpdateOptions = true;
                this.needsDraw = true;
            }
        }
    },

    handleRangeChange: {
        value: function () {
            this._needsUpdateOptions = true;
            this.needsDraw = true;
        }
    },

    draw: {
        value: function() {
            var optionsFragment,
                optionElement,
                selectedMap,
                i;

            if (this._needsUpdateOptions) {
                selectedMap = new Map();
                if (this._selectedValues) {
                    for (i = 0; i < this._selectedValues.length; i++) {
                        selectedMap.set(this._selectedValues[i], true);
                    }
                }
                optionsFragment = document.createDocumentFragment();

                if (this._options) {
                    for (i = 0; i < this._options.length; i++) {
                        optionElement = document.createElement("option");
                        optionElement.selected = selectedMap.has(this._options[i][this._valuePropertyName] || this._options[i]);
                        optionElement.textContent = this._options[i][this._labelPropertyName] || this._options[i];
                        optionsFragment.appendChild(optionElement);
                    }
                }

                this._element.innerHTML = "";
                this._element.appendChild(optionsFragment);
                this._needsUpdateOptions = false;
            }
        }
    }

});
