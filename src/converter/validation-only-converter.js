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
                this.validator.validate(value);
            }
            return value;
        }
    }
});
