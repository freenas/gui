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
                        valuePath = this.valuePath,
                        labelPath = this.labelPath,
                        value, label,
                        item;

                    for (i = 0, length = values.length; i < length; i++) {
                        item = values[i];

                        if (typeof item !== "object") {
                            option = new SelectOption().initWithLabel(item);

                        } else {
                            if (valuePath && labelPath) {
                                label = this._getPropertyFromItemAndPath(item, labelPath);
                                value = this._getPropertyFromItemAndPath(item, valuePath);
                            } else {
                                label = item[labelPropertyName];
                                value = item[valuePropertyName];
                            }
                            option = new SelectOption().initWithLabelAndValue(label, value);
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
    },

    _getPropertyFromItemAndPath: {
        value: function(item, path) {
            var result = item,
                pathParts = path.split('.');
            while (pathParts.length > 0 && result) {
                result = result[pathParts.shift()];
            }
            return result;
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
            this.value = value;

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
