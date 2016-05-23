var Component = require("montage/ui/component").Component,
    BytesConverter = require("montage/core/converter/bytes-converter").BytesConverter;

/**
 * @class Disk
 * @extends Component
 */
exports.Disk = Component.specialize({

    _object: {
        value: null
    },

    object: {
        set: function (object) {
            if (this._object !== object) {
                this._object = object;
            }
        },
        get: function () {
            return this._object;
        }
    }

});

exports.defaultBytesConverter = {
    _converter: new BytesConverter(),
    convert: function(size) {
        var tmp = size,
            magnitude = 0;
        while (tmp >= 1) {
            magnitude++;
            tmp = tmp / 1024;
        }
        if (tmp >= 0.01) {
            tmp = Math.round(tmp * 1024) * Math.pow(1024, magnitude - 1); 
        } else {
            tmp = size;
        }
        return this._converter.convert(tmp);
    },

    revert: function(string) {
        return this._converter.revert(string);
    }
};
