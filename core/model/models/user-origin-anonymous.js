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
            name: "ttl",
            valueType: "number"
        }]
    }
});
