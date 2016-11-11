var Montage = require("montage").Montage;

exports.UserOriginAnonymous = Montage.specialize({
    _cached_at: {
        value: null
    },
    cached_at: {
        set: function (value) {
            if (this._cached_at !== value) {
                this._cached_at = value;
            }
        },
        get: function () {
            return this._cached_at;
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
    _read_only: {
        value: null
    },
    read_only: {
        set: function (value) {
            if (this._read_only !== value) {
                this._read_only = value;
            }
        },
        get: function () {
            return this._read_only;
        }
    },
    _ttl: {
        value: null
    },
    ttl: {
        set: function (value) {
            if (this._ttl !== value) {
                this._ttl = value;
            }
        },
        get: function () {
            return this._ttl;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "cached_at",
            valueType: "datetime"
        }, {
            mandatory: false,
            name: "directory",
            valueType: "String"
        }, {
            mandatory: false,
            name: "read_only",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "ttl",
            valueType: "number"
        }]
    }
});
