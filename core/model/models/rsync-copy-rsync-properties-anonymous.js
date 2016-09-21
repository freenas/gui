var Montage = require("montage").Montage;

exports.RsyncCopyRsyncPropertiesAnonymous = Montage.specialize({
    _archive: {
        value: null
    },
    archive: {
        set: function (value) {
            if (this._archive !== value) {
                this._archive = value;
            }
        },
        get: function () {
            return this._archive;
        }
    },
    _compress: {
        value: null
    },
    compress: {
        set: function (value) {
            if (this._compress !== value) {
                this._compress = value;
            }
        },
        get: function () {
            return this._compress;
        }
    },
    _delay_updates: {
        value: null
    },
    delay_updates: {
        set: function (value) {
            if (this._delay_updates !== value) {
                this._delay_updates = value;
            }
        },
        get: function () {
            return this._delay_updates;
        }
    },
    _delete: {
        value: null
    },
    delete: {
        set: function (value) {
            if (this._delete !== value) {
                this._delete = value;
            }
        },
        get: function () {
            return this._delete;
        }
    },
    _extra: {
        value: null
    },
    extra: {
        set: function (value) {
            if (this._extra !== value) {
                this._extra = value;
            }
        },
        get: function () {
            return this._extra;
        }
    },
    _preserve_attributes: {
        value: null
    },
    preserve_attributes: {
        set: function (value) {
            if (this._preserve_attributes !== value) {
                this._preserve_attributes = value;
            }
        },
        get: function () {
            return this._preserve_attributes;
        }
    },
    _preserve_permissions: {
        value: null
    },
    preserve_permissions: {
        set: function (value) {
            if (this._preserve_permissions !== value) {
                this._preserve_permissions = value;
            }
        },
        get: function () {
            return this._preserve_permissions;
        }
    },
    _recursive: {
        value: null
    },
    recursive: {
        set: function (value) {
            if (this._recursive !== value) {
                this._recursive = value;
            }
        },
        get: function () {
            return this._recursive;
        }
    },
    _times: {
        value: null
    },
    times: {
        set: function (value) {
            if (this._times !== value) {
                this._times = value;
            }
        },
        get: function () {
            return this._times;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "archive",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "compress",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "delay_updates",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "delete",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "extra",
            valueType: "String"
        }, {
            mandatory: false,
            name: "preserve_attributes",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "preserve_permissions",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "recursive",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "times",
            valueType: "boolean"
        }]
    }
});
