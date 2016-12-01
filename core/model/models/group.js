var Montage = require("montage").Montage;

exports.Group = Montage.specialize({
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
    _members: {
        value: null
    },
    members: {
        set: function (value) {
            if (this._members !== value) {
                this._members = value;
            }
        },
        get: function () {
            return this._members;
        }
    },
    _name: {
        value: null
    },
    name: {
        set: function (value) {
            if (this._name !== value) {
                this._name = value;
            }
        },
        get: function () {
            return this._name;
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
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "builtin",
            readOnly: true,
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "gid",
            valueType: "number"
        }, {
            mandatory: false,
            name: "id",
            valueType: "String"
        }, {
            mandatory: false,
            name: "members",
            readOnly: true,
            valueType: "array"
        }, {
            mandatory: false,
            name: "name",
            valueType: "String"
        }, {
            mandatory: false,
            name: "origin",
            valueType: "object"
        }, {
            mandatory: false,
            name: "sid",
            readOnly: true,
            valueType: "String"
        }, {
            mandatory: false,
            name: "sudo",
            valueType: "boolean"
        }]
    },
    userInterfaceDescriptor: {
        value: {
            inspectorComponentModule: {
                id: 'ui/sections/accounts/inspectors/group.reel'
            },
            iconComponentModule: {
                id: 'ui/icons/group.reel'
            },
            collectionInspectorComponentModule: {
                id: 'ui/controls/viewer.reel'
            },
            nameExpression: "id.defined() ? name : 'Create a group'",
            collectionNameExpression: "'Groups'",
            creatorComponentModule: {
                id: 'ui/sections/accounts/inspectors/group.reel'
            },
            listControlsComponentModule: {
                id: 'ui/accounts/accounts-list-options.reel'
            },
            subLabelExpression: "origin.domain"
        }
    }
});
