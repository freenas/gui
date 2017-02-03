var Converter = require("montage/core/converter/converter").Converter,
    moment = require('moment');

exports.Iso8601ToStringConverter = Converter.specialize({
    convert: {
        value: function(iso8601) {
            return moment(iso8601).format('LLLL');
        }
    },

    revert: {
        value: function(string) {
            return new Date(string).toISOString();
        }
    }
});
