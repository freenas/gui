var Montage = require("montage/core/core").Montage;

exports.ContainerDeviceCdrom = Montage.specialize({
    _path: {
        value: null
    },
    path: {
        set: function (value) {
            if (this._path !== value) {
                this._path = value;
            }
        },
        get: function () {
            return this._path;
        }
    }
});
