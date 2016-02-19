/**
 * @requires montage/core/converter/converter
 */
var Converter = require("montage/core/converter/converter").Converter;
var Montage = require("montage/core/core").Montage;

/**
 * todo
 * @class SelectOptionConverter
 * @extends Converter
 */
var SelectOptionConverter = exports.SelectOptionConverter = Converter.specialize({

    labelPropertyName: {
        value: "label"
    },

    valuePropertyName: {
        value: "value"
    },

    _values: {
        value: null
    },

    convert: {
        value: function (values) {
            this._values = values;

            var options = [];

            if (Array.isArray(values)) {
                var labelKeys,
                    valueKeys,
                    option,
                    length,
                    i;

                if (values.length === 2 && Array.isArray((labelKeys = values[0])) &&
                    Array.isArray((valueKeys = values[1])) && labelKeys.length === valueKeys.length) {

                    for (i = 0, length = labelKeys.length; i < length; i++) {
                        options.push(new SelectOption().initWithLabelAndValue(labelKeys[i], valueKeys[i]));
                    }
                } else {
                    var valuePropertyName = this.valuePropertyName,
                        labelPropertyName = this.labelPropertyName,
                        item;

                    for (i = 0, length = values.length; i < length; i++) {
                        item = values[i];

                        if (typeof item !== "object") {
                            option = new SelectOption().initWithLabel(item);

                        } else {
                            option = new SelectOption().initWithLabelAndValue(item[labelPropertyName], item[valuePropertyName]);
                        }

                        options.push(option);
                    }
                }
            }

            return options;
        }
    },

    revert: {
        value: function () {
            return this._values;
        }
    }

});

var SelectOption = exports.SelectOption = Montage.specialize({

    initWithLabel: {
        value: function (label) {
            this.label = this.value = label + "";

            return this;
        }
    },

    initWithLabelAndValue: {
        value: function (label, value) {
            this.label = label + "";
            this.value = value + "";

            return this;
        }
    },

    label: {
        value: null
    },

    value: {
        value: null
    }

});
