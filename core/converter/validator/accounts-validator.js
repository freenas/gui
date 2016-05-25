/**
 * @requires montage/core/converter/converter
 */
var Validator = require("montage/core/converter/converter").Validator;

/**
 * @class AccountsValidator
 * @extends Validator
 */
exports.AccountValidator = Validator.specialize({

    accountOptions: {
        value: null
    },

    validate: {
        value: function (name) {
            return !!this.accountOptions.find(function(x) { return x.name === name; });
        }
    }
});
