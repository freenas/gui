var Montage = require("montage").Montage;

exports.ShareAfp = Montage.specialize({
    _afp3_privileges: {
        value: null
    },
    afp3_privileges: {
        set: function (value) {
            if (this._afp3_privileges !== value) {
                this._afp3_privileges = value;
            }
        },
        get: function () {
            return this._afp3_privileges;
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
    _default_directory_perms: {
        value: null
    },
    default_directory_perms: {
        set: function (value) {
            if (this._default_directory_perms !== value) {
                this._default_directory_perms = value;
            }
        },
        get: function () {
            return this._default_directory_perms;
        }
    },
    _default_file_perms: {
        value: null
    },
    default_file_perms: {
        set: function (value) {
            if (this._default_file_perms !== value) {
                this._default_file_perms = value;
            }
        },
        get: function () {
            return this._default_file_perms;
        }
    },
    _default_umask: {
        value: null
    },
    default_umask: {
        set: function (value) {
            if (this._default_umask !== value) {
                this._default_umask = value;
            }
        },
        get: function () {
            return this._default_umask;
        }
    },
    _groups_allow: {
        value: null
    },
    groups_allow: {
        set: function (value) {
            if (this._groups_allow !== value) {
                this._groups_allow = value;
            }
        },
        get: function () {
            return this._groups_allow;
        }
    },
    _groups_deny: {
        value: null
    },
    groups_deny: {
        set: function (value) {
            if (this._groups_deny !== value) {
                this._groups_deny = value;
            }
        },
        get: function () {
            return this._groups_deny;
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
    _no_stat: {
        value: null
    },
    no_stat: {
        set: function (value) {
            if (this._no_stat !== value) {
                this._no_stat = value;
            }
        },
        get: function () {
            return this._no_stat;
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
    _ro_groups: {
        value: null
    },
    ro_groups: {
        set: function (value) {
            if (this._ro_groups !== value) {
                this._ro_groups = value;
            }
        },
        get: function () {
            return this._ro_groups;
        }
    },
    _ro_users: {
        value: null
    },
    ro_users: {
        set: function (value) {
            if (this._ro_users !== value) {
                this._ro_users = value;
            }
        },
        get: function () {
            return this._ro_users;
        }
    },
    _rw_groups: {
        value: null
    },
    rw_groups: {
        set: function (value) {
            if (this._rw_groups !== value) {
                this._rw_groups = value;
            }
        },
        get: function () {
            return this._rw_groups;
        }
    },
    _rw_users: {
        value: null
    },
    rw_users: {
        set: function (value) {
            if (this._rw_users !== value) {
                this._rw_users = value;
            }
        },
        get: function () {
            return this._rw_users;
        }
    },
    _time_machine: {
        value: null
    },
    time_machine: {
        set: function (value) {
            if (this._time_machine !== value) {
                this._time_machine = value;
            }
        },
        get: function () {
            return this._time_machine;
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
    _users_allow: {
        value: null
    },
    users_allow: {
        set: function (value) {
            if (this._users_allow !== value) {
                this._users_allow = value;
            }
        },
        get: function () {
            return this._users_allow;
        }
    },
    _users_deny: {
        value: null
    },
    users_deny: {
        set: function (value) {
            if (this._users_deny !== value) {
                this._users_deny = value;
            }
        },
        get: function () {
            return this._users_deny;
        }
    },
    _zero_dev_numbers: {
        value: null
    },
    zero_dev_numbers: {
        set: function (value) {
            if (this._zero_dev_numbers !== value) {
                this._zero_dev_numbers = value;
            }
        },
        get: function () {
            return this._zero_dev_numbers;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "afp3_privileges",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "comment",
            valueType: "String"
        }, {
            mandatory: false,
            name: "default_directory_perms",
            valueObjectPrototypeName: "UnixPermissions",
            valueType: "object"
        }, {
            mandatory: false,
            name: "default_file_perms",
            valueObjectPrototypeName: "UnixPermissions",
            valueType: "object"
        }, {
            mandatory: false,
            name: "default_umask",
            valueObjectPrototypeName: "UnixPermissions",
            valueType: "object"
        }, {
            mandatory: false,
            name: "groups_allow",
            valueType: "array"
        }, {
            mandatory: false,
            name: "groups_deny",
            valueType: "array"
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
            name: "no_stat",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "read_only",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "ro_groups",
            valueType: "array"
        }, {
            mandatory: false,
            name: "ro_users",
            valueType: "array"
        }, {
            mandatory: false,
            name: "rw_groups",
            valueType: "array"
        }, {
            mandatory: false,
            name: "rw_users",
            valueType: "array"
        }, {
            mandatory: false,
            name: "time_machine",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "type"
        }, {
            mandatory: false,
            name: "users_allow",
            valueType: "array"
        }, {
            mandatory: false,
            name: "users_deny",
            valueType: "array"
        }, {
            mandatory: false,
            name: "zero_dev_numbers",
            valueType: "boolean"
        }]
    }
});
