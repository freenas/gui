var Montage = require("montage").Montage;

exports.ShareSmb = Montage.specialize({
    _browseable: {
        value: null
    },
    browseable: {
        set: function (value) {
            if (this._browseable !== value) {
                this._browseable = value;
            }
        },
        get: function () {
            return this._browseable;
        }
    },
    _comment: {
        value: null
    },
    comment: {
        set: function (value) {
            if (this._comment !== value) {
                this._comment = value;
            }
        },
        get: function () {
            return this._comment;
        }
    },
    _extra_parameters: {
        value: null
    },
    extra_parameters: {
        set: function (value) {
            if (this._extra_parameters !== value) {
                this._extra_parameters = value;
            }
        },
        get: function () {
            return this._extra_parameters;
        }
    },
    _guest_ok: {
        value: null
    },
    guest_ok: {
        set: function (value) {
            if (this._guest_ok !== value) {
                this._guest_ok = value;
            }
        },
        get: function () {
            return this._guest_ok;
        }
    },
    _guest_only: {
        value: null
    },
    guest_only: {
        set: function (value) {
            if (this._guest_only !== value) {
                this._guest_only = value;
            }
        },
        get: function () {
            return this._guest_only;
        }
    },
    _hosts_allow: {
        value: null
    },
    hosts_allow: {
        set: function (value) {
            if (this._hosts_allow !== value) {
                this._hosts_allow = value;
            }
        },
        get: function () {
            return this._hosts_allow;
        }
    },
    _hosts_deny: {
        value: null
    },
    hosts_deny: {
        set: function (value) {
            if (this._hosts_deny !== value) {
                this._hosts_deny = value;
            }
        },
        get: function () {
            return this._hosts_deny;
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
    _recyclebin: {
        value: null
    },
    recyclebin: {
        set: function (value) {
            if (this._recyclebin !== value) {
                this._recyclebin = value;
            }
        },
        get: function () {
            return this._recyclebin;
        }
    },
    _show_hidden_files: {
        value: null
    },
    show_hidden_files: {
        set: function (value) {
            if (this._show_hidden_files !== value) {
                this._show_hidden_files = value;
            }
        },
        get: function () {
            return this._show_hidden_files;
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
    },
    _vfs_objects: {
        value: null
    },
    vfs_objects: {
        set: function (value) {
            if (this._vfs_objects !== value) {
                this._vfs_objects = value;
            }
        },
        get: function () {
            return this._vfs_objects;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "browseable",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "comment",
            valueType: "String"
        }, {
            mandatory: false,
            name: "extra_parameters",
            valueType: "object"
        }, {
            mandatory: false,
            name: "guest_ok",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "guest_only",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "hosts_allow",
            valueType: "array"
        }, {
            mandatory: false,
            name: "hosts_deny",
            valueType: "array"
        }, {
            mandatory: false,
            name: "read_only",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "recyclebin",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "show_hidden_files",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "type"
        }, {
            mandatory: false,
            name: "vfs_objects",
            valueType: "array"
        }]
    }
});
