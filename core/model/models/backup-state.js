var Montage = require("montage").Montage;

exports.BackupState = Montage.specialize({
    _dataset: {
        value: null
    },
    dataset: {
        set: function (value) {
            if (this._dataset !== value) {
                this._dataset = value;
            }
        },
        get: function () {
            return this._dataset;
        }
    },
    _hostname: {
        value: null
    },
    hostname: {
        set: function (value) {
            if (this._hostname !== value) {
                this._hostname = value;
            }
        },
        get: function () {
            return this._hostname;
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
            name: "dataset",
            valueType: "String"
        }, {
            mandatory: false,
            name: "hostname",
            valueType: "String"
        }, {
            mandatory: false,
            name: "snapshots",
            valueType: "array"
        }]
    }
});
