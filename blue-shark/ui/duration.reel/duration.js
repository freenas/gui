/**
 * @module ui/duration.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class Duration
 * @extends Component
 */
exports.Duration = Component.specialize(/** @lends Duration# */ {

    unit: {
        value: null
    },

    count: {
        value: null
    },

    _value: {
        value: null
    },

    value: {
        value: null
    },

    enterDocument: {
        value: function(isFirstTime) {
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
            if (this.value == this._value) {
                this._getSeconds();
            }
        }
    },

    _getSeconds: {
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
            this.count = this.unit ? this.value / this.unit : null;
        }
    }
});
