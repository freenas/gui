var Montage = require("montage").Montage;

exports.DockerImage = Montage.specialize({
    _created_at: {
        value: null
    },
    created_at: {
        set: function (value) {
            if (this._created_at !== value) {
                this._created_at = value;
            }
        },
        get: function () {
            return this._created_at;
        }
    },
    _hosts: {
        value: null
    },
    hosts: {
        set: function (value) {
            if (this._hosts !== value) {
                this._hosts = value;
            }
        },
        get: function () {
            return this._hosts;
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
    _names: {
        value: null
    },
    names: {
        set: function (value) {
            if (this._names !== value) {
                this._names = value;
            }
        },
        get: function () {
            return this._names;
        }
    },
    _presets: {
        value: null
    },
    presets: {
        set: function (value) {
            if (this._presets !== value) {
                this._presets = value;
            }
        },
        get: function () {
            return this._presets;
        }
    },
    _size: {
        value: null
    },
    size: {
        set: function (value) {
            if (this._size !== value) {
                this._size = value;
            }
        },
        get: function () {
            return this._size;
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
            name: "created_at",
            valueType: "String"
        }, {
            mandatory: false,
            name: "hosts",
            valueType: "array"
        }, {
            mandatory: false,
            name: "id",
            valueType: "String"
        }, {
            mandatory: false,
            name: "names",
            valueType: "array"
        }, {
            mandatory: false,
            name: "presets",
            valueType: "object"
        }, {
            mandatory: false,
            name: "size",
            valueType: "number"
        }, {
            mandatory: false,
            name: "version",
            valueType: "number"
        }]
    },
    userInterfaceDescriptor: {
        value: {
            nameExpression: "names.defined() ? names.join(' ') : 'Choose a collection'",
            collectionNameExpression: "'Images'",
            daoModuleId: "core/dao/docker-image-dao",
            inspectorComponentModule: {
                id: 'ui/sections/containers/inspectors/docker-image.reel'
            },
            creatorComponentModule: {
                id: 'ui/sections/containers/controls/docker-collection-list.reel'
            },
            createLabel: "Pull"
        }
    }
});
