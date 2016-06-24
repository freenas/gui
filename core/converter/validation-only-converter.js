var Converter = require("montage/core/converter/converter").Converter;

exports.ValidationOnlyConverter = Converter.specialize({
    convert: {
        value: function(value) {
            return value;
        }
    },
    revert: {
        value: function(value) {
            if (this.validator && typeof this.validator.validate === "function") {
                try {
                    this.validator.validate(value);
                } catch (e) {
                    throw e;
                }
            }
            return value;
        }
    }
});
