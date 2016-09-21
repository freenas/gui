var Montage = require("montage").Montage;

exports.BootEnvironment = Montage.specialize({
    _active: {
        value: null
    },
    active: {
        set: function (value) {
            if (this._active !== value) {
                this._active = value;
            }
        },
        get: function () {
            return this._active;
        }
    },
    _created: {
        value: null
    },
    created: {
        set: function (value) {
            if (this._created !== value) {
                this._created = value;
            }
        },
        get: function () {
            return this._created;
        }
    },
    _id: {
        value: null
    },
    id: {
        set: function (value) {
            if (this._id !== value) {
                this._id = value;
            }
        },
        get: function () {
            return this._id;
        }
    },
    _mountpoint: {
        value: null
    },
    mountpoint: {
        set: function (value) {
            if (this._mountpoint !== value) {
                this._mountpoint = value;
            }
        },
        get: function () {
            return this._mountpoint;
        }
    },
    _on_reboot: {
        value: null
    },
    on_reboot: {
        set: function (value) {
            if (this._on_reboot !== value) {
                this._on_reboot = value;
            }
        },
        get: function () {
            return this._on_reboot;
        }
    },
    _realname: {
        value: null
    },
    realname: {
        set: function (value) {
            if (this._realname !== value) {
                this._realname = value;
            }
        },
        get: function () {
            return this._realname;
        }
    },
    _space: {
        value: null
    },
    space: {
        set: function (value) {
            if (this._space !== value) {
                this._space = value;
            }
        },
        get: function () {
            return this._space;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "active",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "created",
            readOnly: true,
            valueType: "datetime"
        }, {
            mandatory: false,
            name: "id",
            valueType: "String"
        }, {
            mandatory: false,
            name: "mountpoint",
            readOnly: true,
            valueType: "String"
        }, {
            mandatory: false,
            name: "on_reboot",
            readOnly: true,
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "realname",
            readOnly: true,
            valueType: "String"
        }, {
            mandatory: false,
            name: "space",
            readOnly: true,
            valueType: "number"
        }]
    }
});
