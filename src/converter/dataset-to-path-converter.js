var Converter = require("montage/core/converter/converter").Converter;

exports.DatasetToPathConverter = Converter.specialize({

    _VOLUME_MOUNTPOINT: {
        value: "/mnt/"
    },

    _VOLUME_MOUNTPOINT_REGEXP: {
        value: null
    },

    constructor: {
        value: function() {
            this._VOLUME_MOUNTPOINT_REGEXP = new RegExp("^" + this._VOLUME_MOUNTPOINT);
        }
    },

    convert: {
        value: function(dataset) {
            return this._VOLUME_MOUNTPOINT + dataset;
        }
    },

    revert: {
        value: function(path) {
            return path.replace(this._VOLUME_MOUNTPOINT_REGEXP, '');
        }
    }
});
