var Montage = require("montage").Montage;

exports.BackupSsh = Montage.specialize({
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
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "directory",
            valueType: "String"
        }, {
            mandatory: false,
            name: "peer",
            valueType: "String"
        }, {
            mandatory: false,
            name: "type"
        }]
    }
});
