var Converter = require("montage/core/converter/converter").Converter,
    Validator = require("montage/core/converter/converter").Validator;

exports.StringToIntegerConverter = Converter.specialize({

    _EMPTY_STRING: {
        value: ""
    },

    convert: {
        value: function(numberToConvert) {
            return numberToConvert + this._EMPTY_STRING;
        }
    },

    revert: {
        value: function(stringToRevert) {
            var isValid = true;
            if ( this.validator && typeof this.validator.validate === "function") {
                isValid = this.validator.validate(stringToRevert);
            }
            if (isValid) {
                return parseInt(stringToRevert);
            } else {
                return stringToConvert;
            }
        }
    }
});
