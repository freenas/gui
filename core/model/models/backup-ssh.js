var Montage = require("montage").Montage;

exports.BackupSsh = Montage.specialize({
    "_%type": {
        value: null
    },
    "%type": {
        set: function (value) {
            if (this["_%type"] !== value) {
                this["_%type"] = value;
            }
        },
        get: function () {
            return this["_%type"];
        }
    },
    _directory: {
        value: null
    },
    directory: {
        set: function (value) {
            if (this._directory !== value) {
                this._directory = value;
            }
        },
        get: function () {
            return this._directory;
        }
    },
    _peer: {
        value: null
    },
    peer: {
        set: function (value) {
            if (this._peer !== value) {
                this._peer = value;
            }
        },
        get: function () {
            return this._peer;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "%type"
        }, {
            mandatory: false,
            name: "directory",
            valueType: "String"
        }, {
            mandatory: false,
            name: "peer",
            valueType: "String"
        }]
    }
});
