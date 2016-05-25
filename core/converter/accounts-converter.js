var Converter = require("montage/core/converter/converter").Converter;

/**
 * @class AccountsConverter
 * @extends Converter
 */
exports.AccountsConverter = Converter.specialize({

    accountOptions: {
        value: null
    },

    identifier: {
        value: null
    },

    convert: {
        value: function (id) {
            return this.accountOptions.find(function(x){ return x.id === id; });
        }
    },

    revert: {
        value: function (identifier) {
            var newAccountValue = this.accountOptions.find(function(x) { return x[ this.identifier ] === identifier; });
            return newAccountValue ? newAccountValue.id : null;
        }
    }
});