var Montage = require("montage").Montage;

exports.UpdateInfo = Montage.specialize({
    _available: {
        value: null
    },
    available: {
        set: function (value) {
            if (this._available !== value) {
                this._available = value;
            }
        },
        get: function () {
            return this._available;
        }
    },
    _changelog: {
        value: null
    },
    changelog: {
        set: function (value) {
            if (this._changelog !== value) {
                this._changelog = value;
            }
        },
        get: function () {
            return this._changelog;
        }
    },
    _downloaded: {
        value: null
    },
    downloaded: {
        set: function (value) {
            if (this._downloaded !== value) {
                this._downloaded = value;
            }
        },
        get: function () {
            return this._downloaded;
        }
    },
    _installed: {
        value: null
    },
    installed: {
        set: function (value) {
            if (this._installed !== value) {
                this._installed = value;
            }
        },
        get: function () {
            return this._installed;
        }
    },
    _installed_version: {
        value: null
    },
    installed_version: {
        set: function (value) {
            if (this._installed_version !== value) {
                this._installed_version = value;
            }
        },
        get: function () {
            return this._installed_version;
        }
    },
    _notes: {
        value: null
    },
    notes: {
        set: function (value) {
            if (this._notes !== value) {
                this._notes = value;
            }
        },
        get: function () {
            return this._notes;
        }
    },
    _notice: {
        value: null
    },
    notice: {
        set: function (value) {
            if (this._notice !== value) {
                this._notice = value;
            }
        },
        get: function () {
            return this._notice;
        }
    },
    _operations: {
        value: null
    },
    operations: {
        set: function (value) {
            if (this._operations !== value) {
                this._operations = value;
            }
        },
        get: function () {
            return this._operations;
        }
    },
    _version: {
        value: null
    },
    version: {
        set: function (value) {
            if (this._version !== value) {
                this._version = value;
            }
        },
        get: function () {
            return this._version;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "available",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "changelog",
            valueType: "array"
        }, {
            mandatory: false,
            name: "downloaded",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "installed",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "installed_version",
            valueType: "String"
        }, {
            mandatory: false,
            name: "notes",
            valueType: "object"
        }, {
            mandatory: false,
            name: "notice",
            valueType: "String"
        }, {
            mandatory: false,
            name: "operations",
            valueObjectPrototypeName: "UpdateOps",
            valueType: "object"
        }, {
            mandatory: false,
            name: "version",
            valueType: "String"
        }]
    }
});
