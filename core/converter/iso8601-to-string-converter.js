var Converter = require("montage/core/converter/converter").Converter,
    DateConverter = require("montage/core/converter/date-converter").DateConverter;

exports.Iso8601ToStringConverter = Converter.specialize({
    convert: {
        value: function(iso8601) {
            if (iso8601) {
                return new Date(iso8601).toString();
            } else {
                return '';
            }
        }
    },

    revert: {
        value: function(string) {
            return new Date(string).toISOString();
        }
    }
});
