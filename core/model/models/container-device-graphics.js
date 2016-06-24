var Montage = require("montage/core/core").Montage;

exports.ContainerDeviceGraphics = Montage.specialize({
    _resolution: {
        value: null
    },
    resolution: {
        set: function (value) {
            if (this._resolution !== value) {
                this._resolution = value;
            }
        },
        get: function () {
            return this._resolution;
        }
    }
});
