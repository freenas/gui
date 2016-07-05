var AbstractModel = require("core/model/abstract-model").AbstractModel;

exports.Group = AbstractModel.specialize({
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
            valueType: "array"
        }, {
            mandatory: false,
            name: "name",
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
                id: 'ui/inspectors/group.reel'
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
                id: 'ui/inspectors/group.reel'
            }
        }
    }
});
