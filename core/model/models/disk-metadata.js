var Montage = require("montage/core/core").Montage;

exports.DiskMetadata = Montage.specialize({
    _disk: {
        value: null
    },
    disk: {
        set: function (value) {
            if (this._disk !== value) {
                this._disk = value;
            }
        },
        get: function () {
            return this._disk;
        }
    },
    _metadata: {
        value: null
    },
    metadata: {
        set: function (value) {
            if (this._metadata !== value) {
                this._metadata = value;
            }
        },
        get: function () {
            return this._metadata;
        }
    }
});
