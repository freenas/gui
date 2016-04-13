var Converter = require("montage/core/converter/converter").Converter;

exports.IdentityConverter = Converter.specialize({

    convert: {
        value: function (value) {
            return value;
        }
    },

    revert: {
        value: function (value) {
            var result;
            if (this.validator && this.validator.validate(value)) {
                result = value;
            }
            return result;
        }
    }
});
