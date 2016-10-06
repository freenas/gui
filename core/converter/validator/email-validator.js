/**
 * @requires montage/core/converter/converter
 */
var Validator = require("montage/core/converter/converter").Validator;

exports.EmailValidator = Validator.specialize({
    EMAIL_REGEX: {
        value: /^\b[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]*[a-zA-Z0-9]\.[a-zA-Z]{2,4}\b$/
    },

    errorMessage: {
        value: null
    },

    _integerValidator: {
        value: null
    },

    validate: {
        value: function (value) {
            if (this.EMAIL_REGEX.test(value)) {
                return true;
            } else {
                throw new Error(this.errorMessage);
            }
        }
    }
});
