var Converter = require("montage/core/converter/converter").Converter;

exports.LoadToStringConverter = Converter.specialize({
    convert: {
        value: function(load) {
            if (load) {
                return load.map(function(x) {
                    return Math.round(x * 100) / 100;
                }).join(' ');
            } else {
                return '';
            }
        }
    },

    revert: {
        value: function(string) {
            return string.split(' ').map(function(x) {
                return +x;
            });
        }
    }
});
