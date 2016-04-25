var Converter = require("montage/core/converter/converter").Converter,
    Validator = require("montage/core/converter/converter").Validator;

exports.StringToIntegerOrNullConverter = Converter.specialize({

    _EMPTY_STRING: {
        value: ""
    },

    convert: {
        value: function(valueToConvert) {
            if (valueToConvert === null || valueToConvert === undefined) {
                return this._EMPTY_STRING;
            } else {
                return valueToConvert + this._EMPTY_STRING;
            }
        }
    },

    revert: {
        value: function(valueToRevert) {
            var isValid = true;
            if ( this.validator && typeof this.validator.validate === "function") {
                try {
                    this.validator.validate(valueToRevert);
                } catch (e) {
                    if (valueToRevert === "") {
                        return null;
                    }
                    throw e;
                }
            }
            if (isValid) {
                return parseInt(valueToRevert);
            } else {
                return valueToRevert;
            }
        }
    }
});
