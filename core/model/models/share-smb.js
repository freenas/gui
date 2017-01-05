var Montage = require("montage").Montage;

exports.ShareSmb = Montage.specialize({
    "_%type": {
        value: null
    },
    "%type": {
        set: function (value) {
            if (this["_%type"] !== value) {
                this["_%type"] = value;
            }
        },
        get: function () {
            return this["_%type"];
        }
    },
    _allocation_roundup_size: {
        value: null
    },
    allocation_roundup_size: {
        set: function (value) {
            if (this._allocation_roundup_size !== value) {
                this._allocation_roundup_size = value;
            }
        },
        get: function () {
            return this._allocation_roundup_size;
        }
    },
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
    _case_sensitive: {
        value: null
    },
    case_sensitive: {
        set: function (value) {
            if (this._case_sensitive !== value) {
                this._case_sensitive = value;
            }
        },
        get: function () {
            return this._case_sensitive;
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
    _ea_support: {
        value: null
    },
    ea_support: {
        set: function (value) {
            if (this._ea_support !== value) {
                this._ea_support = value;
            }
        },
        get: function () {
            return this._ea_support;
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
    _fruit_metadata: {
        value: null
    },
    fruit_metadata: {
        set: function (value) {
            if (this._fruit_metadata !== value) {
                this._fruit_metadata = value;
            }
        },
        get: function () {
            return this._fruit_metadata;
        }
    },
    _full_audit_failure: {
        value: null
    },
    full_audit_failure: {
        set: function (value) {
            if (this._full_audit_failure !== value) {
                this._full_audit_failure = value;
            }
        },
        get: function () {
            return this._full_audit_failure;
        }
    },
    _full_audit_prefix: {
        value: null
    },
    full_audit_prefix: {
        set: function (value) {
            if (this._full_audit_prefix !== value) {
                this._full_audit_prefix = value;
            }
        },
        get: function () {
            return this._full_audit_prefix;
        }
    },
    _full_audit_priority: {
        value: null
    },
    full_audit_priority: {
        set: function (value) {
            if (this._full_audit_priority !== value) {
                this._full_audit_priority = value;
            }
        },
        get: function () {
            return this._full_audit_priority;
        }
    },
    _full_audit_success: {
        value: null
    },
    full_audit_success: {
        set: function (value) {
            if (this._full_audit_success !== value) {
                this._full_audit_success = value;
            }
        },
        get: function () {
            return this._full_audit_success;
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
    _map_archive: {
        value: null
    },
    map_archive: {
        set: function (value) {
            if (this._map_archive !== value) {
                this._map_archive = value;
            }
        },
        get: function () {
            return this._map_archive;
        }
    },
    _map_hidden: {
        value: null
    },
    map_hidden: {
        set: function (value) {
            if (this._map_hidden !== value) {
                this._map_hidden = value;
            }
        },
        get: function () {
            return this._map_hidden;
        }
    },
    _map_readonly: {
        value: null
    },
    map_readonly: {
        set: function (value) {
            if (this._map_readonly !== value) {
                this._map_readonly = value;
            }
        },
        get: function () {
            return this._map_readonly;
        }
    },
    _map_system: {
        value: null
    },
    map_system: {
        set: function (value) {
            if (this._map_system !== value) {
                this._map_system = value;
            }
        },
        get: function () {
            return this._map_system;
        }
    },
    _previous_versions: {
        value: null
    },
    previous_versions: {
        set: function (value) {
            if (this._previous_versions !== value) {
                this._previous_versions = value;
            }
        },
        get: function () {
            return this._previous_versions;
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
    _store_dos_attributes: {
        value: null
    },
    store_dos_attributes: {
        set: function (value) {
            if (this._store_dos_attributes !== value) {
                this._store_dos_attributes = value;
            }
        },
        get: function () {
            return this._store_dos_attributes;
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
            name: "%type"
        }, {
            mandatory: false,
            name: "allocation_roundup_size",
            valueType: "number"
        }, {
            mandatory: false,
            name: "browseable",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "case_sensitive",
            valueType: "String"
        }, {
            mandatory: false,
            name: "comment",
            valueType: "String"
        }, {
            mandatory: false,
            name: "ea_support",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "extra_parameters",
            valueType: "object"
        }, {
            mandatory: false,
            name: "fruit_metadata",
            valueType: "String"
        }, {
            mandatory: false,
            name: "full_audit_failure",
            valueType: "String"
        }, {
            mandatory: false,
            name: "full_audit_prefix",
            valueType: "String"
        }, {
            mandatory: false,
            name: "full_audit_priority",
            valueType: "String"
        }, {
            mandatory: false,
            name: "full_audit_success",
            valueType: "String"
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
            name: "map_archive",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "map_hidden",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "map_readonly",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "map_system",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "previous_versions",
            valueType: "boolean"
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
            name: "store_dos_attributes",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "vfs_objects",
            valueType: "array"
        }]
    }
});
