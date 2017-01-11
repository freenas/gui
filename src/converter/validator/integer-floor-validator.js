/**
 * @requires montage/core/converter/converter
 */
var Validator = require("montage/core/converter/converter").Validator,
    IntegerValidator = require("core/converter/validator/integer-validator").IntegerValidator;

exports.IntegerFloorValidator = Validator.specialize({
    floor: {
        value: null
    },

    errorMessage: {
        value: null
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
            } catch (e) {
                throw new Error(this.errorMessage);
            }
            if (+value >= this.floor) {
                return true;
            } else {
                throw new Error(this.errorMessage);
            }

        }
    }

});
