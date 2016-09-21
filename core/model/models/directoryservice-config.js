var Montage = require("montage").Montage;

exports.DirectoryserviceConfig = Montage.specialize({
    _cache_enumerations: {
        value: null
    },
    cache_enumerations: {
        set: function (value) {
            if (this._cache_enumerations !== value) {
                this._cache_enumerations = value;
            }
        },
        get: function () {
            return this._cache_enumerations;
        }
    },
    _cache_lookups: {
        value: null
    },
    cache_lookups: {
        set: function (value) {
            if (this._cache_lookups !== value) {
                this._cache_lookups = value;
            }
        },
        get: function () {
            return this._cache_lookups;
        }
    },
    _cache_ttl: {
        value: null
    },
    cache_ttl: {
        set: function (value) {
            if (this._cache_ttl !== value) {
                this._cache_ttl = value;
            }
        },
        get: function () {
            return this._cache_ttl;
        }
    },
    _search_order: {
        value: null
    },
    search_order: {
        set: function (value) {
            if (this._search_order !== value) {
                this._search_order = value;
            }
        },
        get: function () {
            return this._search_order;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "cache_enumerations",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "cache_lookups",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "cache_ttl",
            valueType: "number"
        }, {
            mandatory: false,
            name: "search_order",
            valueType: "array"
        }]
    }
});
