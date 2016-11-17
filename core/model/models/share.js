var Montage = require("montage").Montage;

exports.Share = Montage.specialize({
    _description: {
        value: null
    },
    description: {
        set: function (value) {
            if (this._description !== value) {
                this._description = value;
            }
        },
        get: function () {
            return this._description;
        }
    },
    _enabled: {
        value: null
    },
    enabled: {
        set: function (value) {
            if (this._enabled !== value) {
                this._enabled = value;
            }
        },
        get: function () {
            return this._enabled;
        }
    },
    _filesystem_path: {
        value: null
    },
    filesystem_path: {
        set: function (value) {
            if (this._filesystem_path !== value) {
                this._filesystem_path = value;
            }
        },
        get: function () {
            return this._filesystem_path;
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
    _immutable: {
        value: null
    },
    immutable: {
        set: function (value) {
            if (this._immutable !== value) {
                this._immutable = value;
            }
        },
        get: function () {
            return this._immutable;
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
    _permissions: {
        value: null
    },
    permissions: {
        set: function (value) {
            if (this._permissions !== value) {
                this._permissions = value;
            }
        },
        get: function () {
            return this._permissions;
        }
    },
    _properties: {
        value: null
    },
    properties: {
        set: function (value) {
            if (this._properties !== value) {
                this._properties = value;
            }
        },
        get: function () {
            return this._properties;
        }
    },
    _target_path: {
        value: null
    },
    target_path: {
        set: function (value) {
            if (this._target_path !== value) {
                this._target_path = value;
            }
        },
        get: function () {
            return this._target_path;
        }
    },
    _target_type: {
        value: null
    },
    target_type: {
        set: function (value) {
            if (this._target_type !== value) {
                this._target_type = value;
            }
        },
        get: function () {
            return this._target_type;
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
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "description",
            valueType: "String"
        }, {
            mandatory: false,
            name: "enabled",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "filesystem_path",
            readOnly: true,
            valueType: "String"
        }, {
            mandatory: false,
            name: "id",
            valueType: "String"
        }, {
            mandatory: false,
            name: "immutable",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "name",
            valueType: "String"
        }, {
            mandatory: false,
            name: "permissions",
            valueObjectPrototypeName: "Permissions",
            valueType: "object"
        }, {
            mandatory: false,
            name: "properties",
            valueObjectPrototypeName: "ShareProperties",
            valueType: "object"
        }, {
            mandatory: false,
            name: "target_path",
            valueType: "String"
        }, {
            mandatory: false,
            name: "target_type",
            valueObjectPrototypeName: "ShareTargettype",
            valueType: "object"
        }, {
            mandatory: false,
            name: "type",
            valueType: "String"
        }]
    },
    userInterfaceDescriptor: {
        value: {
            collectionInspectorComponentModule: {
                id: 'ui/controls/viewer.reel'
            },
            collectionNameExpression: "'Shares'",
            inspectorComponentModule: {
                id: 'ui/sections/storage/inspectors/share.reel'
            },
            creatorComponentModule: {
                id: 'ui/sections/storage/inspectors/share-creator.reel'
            },
            wizardComponentModuleId: "ui/sections/wizard/inspectors/share.reel",
            "wizardTitle": "set up shares",
            nameExpression: "!!id ? !!name ? name : id : !!type ? 'New ' + type.toUpperCase() + ' share' : 'Choose a share type'"
        }
    }
});
