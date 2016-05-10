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
                this.disk = object ? object._disk ? object._disk : object : null;
            }
        },
        get: function () {
            return this._object;
        }
    }

});

exports.defaultBytesConverter = new BytesConverter();
