var Component = require("montage/ui/component").Component;

exports.NumberUnit = Component.specialize({

    unit: {
        value: null
    },

    count: {
        value: ''
    },

    _value: {
        value: null
    },

    value: {
        value: null
    },

    enterDocument: {
        value: function(isFirstTime) {
            if (!this.unit && Array.isArray(this.units) && this.units.length > 0) {
                this.unit = this.units[0].value;
            }
            if (isFirstTime) {
                this.addPathChangeListener("unit", this, "_handleInputChange");
                this.addPathChangeListener("count", this, "_handleInputChange");
                this.addPathChangeListener("value", this, "_handleValueChange");
            }
        }
    },

    _handleValueChange: {
        value: function (value) {
            if (value != this._value) {
                this._splitValue();
                this._value = value;
            }
        }
    },

    _handleInputChange: {
        value: function () {
            if (isNaN(this.value) || this.value === this._value) {
                this._getValue();
            }
        }
    },

    _getValue: {
        value: function() {
            this._value = this.unit * this.count;
            this.value = this._value;
        }
    },

    _splitValue: {
        value: function() {
            for (var i = 1, length = this.units.length; i < length; i++) {
                var count = this.value / this.units[i].value;
                if (count < 1 || Math.round(count) !== count) {
                    break;
                }
            }

            this.unit = this.units[i-1].value;
            var count = this.unit ? this.value / this.unit : null;
            this.count = isNaN(count) ? '' : count;
        }
    }
});
