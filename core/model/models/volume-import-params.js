var Montage = require("montage").Montage;

exports.VolumeImportParams = Montage.specialize({
    _disks: {
        value: null
    },
    disks: {
        set: function (value) {
            if (this._disks !== value) {
                this._disks = value;
            }
        },
        get: function () {
            return this._disks;
        }
    },
    _key: {
        value: null
    },
    key: {
        set: function (value) {
            if (this._key !== value) {
                this._key = value;
            }
        },
        get: function () {
            return this._key;
        }
    },
    _key_fd: {
        value: null
    },
    key_fd: {
        set: function (value) {
            if (this._key_fd !== value) {
                this._key_fd = value;
            }
        },
        get: function () {
            return this._key_fd;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "disks",
            valueType: "array"
        }, {
            mandatory: false,
            name: "key",
            valueType: "String"
        }, {
            mandatory: false,
            name: "key_fd",
            valueType: "fd"
        }]
    }
});
