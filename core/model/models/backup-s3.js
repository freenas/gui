var Montage = require("montage").Montage;

exports.BackupS3 = Montage.specialize({
    _bucket: {
        value: null
    },
    bucket: {
        set: function (value) {
            if (this._bucket !== value) {
                this._bucket = value;
            }
        },
        get: function () {
            return this._bucket;
        }
    },
    _folder: {
        value: null
    },
    folder: {
        set: function (value) {
            if (this._folder !== value) {
                this._folder = value;
            }
        },
        get: function () {
            return this._folder;
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
            name: "bucket",
            valueType: "String"
        }, {
            mandatory: false,
            name: "folder",
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
