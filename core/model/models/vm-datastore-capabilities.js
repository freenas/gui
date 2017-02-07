var Montage = require("montage").Montage;

exports.VmDatastoreCapabilities = Montage.specialize({
    _block_devices: {
        value: null
    },
    block_devices: {
        set: function (value) {
            if (this._block_devices !== value) {
                this._block_devices = value;
            }
        },
        get: function () {
            return this._block_devices;
        }
    },
    _clones: {
        value: null
    },
    clones: {
        set: function (value) {
            if (this._clones !== value) {
                this._clones = value;
            }
        },
        get: function () {
            return this._clones;
        }
    },
    _snapshots: {
        value: null
    },
    snapshots: {
        set: function (value) {
            if (this._snapshots !== value) {
                this._snapshots = value;
            }
        },
        get: function () {
            return this._snapshots;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "block_devices",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "clones",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "snapshots",
            valueType: "boolean"
        }]
    }
});
