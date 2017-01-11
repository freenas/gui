var Converter = require("montage/core/converter/converter").Converter,
    Validator = require("montage/core/converter/converter").Validator;

exports.VlanTagConverter = Converter.specialize({

    constructor: {
        value: function() {
            this.super();
            this.validator = new VlanTagValidator();
        }
    },

    convert: {
        value: function (vlanTag) {
            return vlanTag;
        }
    },

    revert: {
        value: function (tagInput) {
            var result;
            if (this.validator.validate(tagInput)) {
                result = parseInt(tagInput, 10);
            } else {
                result = tagInput;
            }
            return result;
        }
    }
});

var VlanTagValidator = Validator.specialize({
    validate: {
        value: function (tagValue) {
            var result = parseInt(tagValue);
            return result > 0 && result < 4096 && /^\d+$/.test(tagValue);
        }
    }
});
