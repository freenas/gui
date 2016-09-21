var Montage = require("montage").Montage;

exports.AclEntryFlags = Montage.specialize({
    _DIRECTORY_INHERIT: {
        value: null
    },
    DIRECTORY_INHERIT: {
        set: function (value) {
            if (this._DIRECTORY_INHERIT !== value) {
                this._DIRECTORY_INHERIT = value;
            }
        },
        get: function () {
            return this._DIRECTORY_INHERIT;
        }
    },
    _FILE_INHERIT: {
        value: null
    },
    FILE_INHERIT: {
        set: function (value) {
            if (this._FILE_INHERIT !== value) {
                this._FILE_INHERIT = value;
            }
        },
        get: function () {
            return this._FILE_INHERIT;
        }
    },
    _INHERIT_ONLY: {
        value: null
    },
    INHERIT_ONLY: {
        set: function (value) {
            if (this._INHERIT_ONLY !== value) {
                this._INHERIT_ONLY = value;
            }
        },
        get: function () {
            return this._INHERIT_ONLY;
        }
    },
    _NO_PROPAGATE_INHERIT: {
        value: null
    },
    NO_PROPAGATE_INHERIT: {
        set: function (value) {
            if (this._NO_PROPAGATE_INHERIT !== value) {
                this._NO_PROPAGATE_INHERIT = value;
            }
        },
        get: function () {
            return this._NO_PROPAGATE_INHERIT;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "DIRECTORY_INHERIT",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "FILE_INHERIT",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "INHERIT_ONLY",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "NO_PROPAGATE_INHERIT",
            valueType: "boolean"
        }]
    }
});
