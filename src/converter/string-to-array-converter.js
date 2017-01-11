/**
 * @requires montage/core/converter/converter
 */
var Converter = require("montage/core/converter/converter").Converter;

/**
 * Converts string to and from array
 * 
 * @class StringToArrayConverter
 * @extends Converter
 */
 exports.StringToArrayConverter = Converter.specialize({

    _delimiter: {
        value: ','
    },

    delimiter: {
        get: function() {
            return this._delimiter;
        },
        set: function(delimiter) {
            this._delimiter = delimiter;
        }
    },

    convert: {
        value: function (value) {
            if (typeof value !== 'string') {
                return (value || []).join(this._delimiter);
            }
            return value;
        }
    },

    revert: {
        value: function (value) {
            if (typeof value === 'string') {
                return value.split(this._delimiter).map(function(item) {
                    return item.trim();
                });
            }
            return value;
        }
    }

 });
