/**
 * @requires montage/core/converter/converter
 */
var Validator = require("montage/core/converter/converter").Validator,
    IntegerValidator = require("core/converter/validator/integer-validator").IntegerValidator;

exports.PositiveIntegerValidator = Validator.specialize({
    _MIN_VALUE: {
        value: 1
    },

    _integerValidator: {
        value: null
    },

    constructor: {
        value: function() {
            this._integerValidator = new IntegerValidator();
        }
    },

    validate: {
        value: function (value) {
            try {
                this._integerValidator.validate(value);
                if (+value >= this._MIN_VALUE) {
                    return true;
                } else {
                    throw new Error();
                }
            } catch (e) {
                throw new Error("Value must be a positive integer.");
            }
        }
    }

});
