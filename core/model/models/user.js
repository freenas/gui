var Montage = require("montage").Montage;

exports.User = Montage.specialize({
    _attributes: {
        value: null
    },
    attributes: {
        set: function (value) {
            if (this._attributes !== value) {
                this._attributes = value;
            }
        },
        get: function () {
            return this._attributes;
        }
    },
    _builtin: {
        value: null
    },
    builtin: {
        set: function (value) {
            if (this._builtin !== value) {
                this._builtin = value;
            }
        },
        get: function () {
            return this._builtin;
        }
    },
    _email: {
        value: null
    },
    email: {
        set: function (value) {
            if (this._email !== value) {
                this._email = value;
            }
        },
        get: function () {
            return this._email;
        }
    },
    _full_name: {
        value: null
    },
    full_name: {
        set: function (value) {
            if (this._full_name !== value) {
                this._full_name = value;
            }
        },
        get: function () {
            return this._full_name;
        }
    },
    _gid: {
        value: null
    },
    gid: {
        set: function (value) {
            if (this._gid !== value) {
                this._gid = value;
            }
        },
        get: function () {
            return this._gid;
        }
    },
    _group: {
        value: null
    },
    group: {
        set: function (value) {
            if (this._group !== value) {
                this._group = value;
            }
        },
        get: function () {
            return this._group;
        }
    },
    _groups: {
        value: null
    },
    groups: {
        set: function (value) {
            if (this._groups !== value) {
                this._groups = value;
            }
        },
        get: function () {
            return this._groups;
        }
    },
    _home: {
        value: null
    },
    home: {
        set: function (value) {
            if (this._home !== value) {
                this._home = value;
            }
        },
        get: function () {
            return this._home;
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
    _lmhash: {
        value: null
    },
    lmhash: {
        set: function (value) {
            if (this._lmhash !== value) {
                this._lmhash = value;
            }
        },
        get: function () {
            return this._lmhash;
        }
    },
    _locked: {
        value: null
    },
    locked: {
        set: function (value) {
            if (this._locked !== value) {
                this._locked = value;
            }
        },
        get: function () {
            return this._locked;
        }
    },
    _nthash: {
        value: null
    },
    nthash: {
        set: function (value) {
            if (this._nthash !== value) {
                this._nthash = value;
            }
        },
        get: function () {
            return this._nthash;
        }
    },
    _origin: {
        value: null
    },
    origin: {
        set: function (value) {
            if (this._origin !== value) {
                this._origin = value;
            }
        },
        get: function () {
            return this._origin;
        }
    },
    _password: {
        value: null
    },
    password: {
        set: function (value) {
            if (this._password !== value) {
                this._password = value;
            }
        },
        get: function () {
            return this._password;
        }
    },
    _password_changed_at: {
        value: null
    },
    password_changed_at: {
        set: function (value) {
            if (this._password_changed_at !== value) {
                this._password_changed_at = value;
            }
        },
        get: function () {
            return this._password_changed_at;
        }
    },
    _password_disabled: {
        value: null
    },
    password_disabled: {
        set: function (value) {
            if (this._password_disabled !== value) {
                this._password_disabled = value;
            }
        },
        get: function () {
            return this._password_disabled;
        }
    },
    _shell: {
        value: null
    },
    shell: {
        set: function (value) {
            if (this._shell !== value) {
                this._shell = value;
            }
        },
        get: function () {
            return this._shell;
        }
    },
    _sid: {
        value: null
    },
    sid: {
        set: function (value) {
            if (this._sid !== value) {
                this._sid = value;
            }
        },
        get: function () {
            return this._sid;
        }
    },
    _sshpubkey: {
        value: null
    },
    sshpubkey: {
        set: function (value) {
            if (this._sshpubkey !== value) {
                this._sshpubkey = value;
            }
        },
        get: function () {
            return this._sshpubkey;
        }
    },
    _sudo: {
        value: null
    },
    sudo: {
        set: function (value) {
            if (this._sudo !== value) {
                this._sudo = value;
            }
        },
        get: function () {
            return this._sudo;
        }
    },
    _uid: {
        value: null
    },
    uid: {
        set: function (value) {
            if (this._uid !== value) {
                this._uid = value;
            }
        },
        get: function () {
            return this._uid;
        }
    },
    _unixhash: {
        value: null
    },
    unixhash: {
        set: function (value) {
            if (this._unixhash !== value) {
                this._unixhash = value;
            }
        },
        get: function () {
            return this._unixhash;
        }
    },
    _username: {
        value: null
    },
    username: {
        set: function (value) {
            if (this._username !== value) {
                this._username = value;
            }
        },
        get: function () {
            return this._username;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "attributes",
            valueType: "object"
        }, {
            mandatory: false,
            name: "builtin",
            readOnly: true,
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "email",
            valueObjectPrototypeName: "Email",
            valueType: "object"
        }, {
            mandatory: false,
            name: "full_name",
            valueType: "String"
        }, {
            mandatory: false,
            name: "gid",
            readOnly: true,
            valueType: "String"
        }, {
            mandatory: false,
            name: "group",
            valueType: "String"
        }, {
            mandatory: false,
            name: "groups",
            valueType: "array"
        }, {
            mandatory: false,
            name: "home",
            valueType: "String"
        }, {
            mandatory: false,
            name: "id",
            valueType: "String"
        }, {
            mandatory: false,
            name: "lmhash",
            valueType: "String"
        }, {
            mandatory: false,
            name: "locked",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "nthash",
            valueType: "String"
        }, {
            mandatory: false,
            name: "origin",
            valueType: "object"
        }, {
            mandatory: false,
            name: "password",
            valueType: "String"
        }, {
            mandatory: false,
            name: "password_changed_at",
            valueType: "datetime"
        }, {
            mandatory: false,
            name: "password_disabled",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "shell",
            valueType: "String"
        }, {
            mandatory: false,
            name: "sid",
            readOnly: true,
            valueType: "String"
        }, {
            mandatory: false,
            name: "sshpubkey",
            valueType: "String"
        }, {
            mandatory: false,
            name: "sudo",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "uid",
            valueType: "number"
        }, {
            mandatory: false,
            name: "unixhash",
            valueType: "String"
        }, {
            mandatory: false,
            name: "username",
            valueType: "String"
        }]
    },
    userInterfaceDescriptor: {
        value: {
            inspectorComponentModule: {
                id: 'ui/sections/accounts/inspectors/user.reel'
            },
            iconComponentModule: {
                id: 'ui/icons/user.reel'
            },
            collectionInspectorComponentModule: {
                id: 'ui/controls/viewer.reel'
            },
            collectionNameExpression: "'Users'",
            creatorComponentModule: {
                id: 'ui/sections/accounts/inspectors/user.reel'
            },
            nameExpression: "id.defined() ? username : 'Create a user'",
            listControlsComponentModule: {
                id: 'ui/accounts/accounts-list-options.reel'
            },
            subLabelExpression: "origin.domain",
            wizardComponentModuleId: "ui/sections/wizard/inspectors/user.reel",
            wizardTitle: "Create a user"
        }
    }
});
