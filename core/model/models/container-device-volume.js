var Montage = require("montage/core/core").Montage;

exports.ContainerDeviceVolume = Montage.specialize({
    _auto: {
        value: null
    },
    auto: {
        set: function (value) {
            if (this._auto !== value) {
                this._auto = value;
            }
        },
        get: function () {
            return this._auto;
        }
    },
    _destination: {
        value: null
    },
    destination: {
        set: function (value) {
            if (this._destination !== value) {
                this._destination = value;
            }
        },
        get: function () {
            return this._destination;
        }
    },
    _type: {
        value: null
    },
    type: {
        set: function (value) {
            if (this._type !== value) {
                this._type = value;
            }
        },
        get: function () {
            return this._type;
        }
    }
});
