/**
 * @requires montage/core/converter/converter
 */
var Validator = require("montage/core/converter/converter").Validator;

exports.UnixAccountIdValidator = Validator.specialize({
    MIN_VALUE: {
        value: 0
    },

    MAX_VALUE: {
        value: Math.pow(2, 32) - 1
    },

    validate: {
        value: function (accountId) {
            var result = true;
            if (accountId) {
                var intValue = parseInt(accountId, 10);
                result = intValue == +accountId &&
                    this.MIN_VALUE <= intValue && intValue <= this.MAX_VALUE;
            }
            return result;
        }
    }

});
