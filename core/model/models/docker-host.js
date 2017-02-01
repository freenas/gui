var Montage = require("montage").Montage;

exports.DockerHost = Montage.specialize({
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
    _target: {
        value: null
    },
    target: {
        set: function (value) {
            if (this._target !== value) {
                this._target = value;
            }
        },
        get: function () {
            return this._target;
        }
    },
    _config: {
        value: null
    },
    config: {
        set: function (value) {
            if (this._config !== value) {
                this._config = value;
            }
        },
        get: function () {
            return this._config;
        }
    },
    _state: {
        value: null
    },
    state: {
        set: function (value) {
            if (this._state !== value) {
                this._state = value;
            }
        },
        get: function () {
            return this._state;
        }
    },
    _status: {
        value: null
    },
    status: {
        set: function (value) {
            if (this._status !== value) {
                this._status = value;
            }
        },
        get: function () {
            return this._status;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "id",
            valueType: "String"
        }, {
            mandatory: false,
            name: "name",
            valueType: "String"
        }, {
            mandatory: false,
            name: "target",
            valueType: "String"
        }, {
            mandatory: false,
            name: "config",
            valueType: "object"
        }, {
            mandatory: false,
            name: "state",
            valueObjectPrototypeName: "DockerHostState",
            valueType: "object"
        }, {
            mandatory: false,
            name: "status",
            valueObjectPrototypeName: "DockerHostStatus",
            valueType: "object"
        }]
    },
    userInterfaceDescriptor: {
        value: {
            nameExpression: "name",
            collectionNameExpression: "'Docker Hosts'",
            daoModuleId: "core/dao/docker-host-dao",
            inspectorComponentModule: {
                id: 'ui/sections/containers/inspectors/docker-host.reel'
            },
            creatorComponentModule: {
                id: 'ui/sections/containers/inspectors/docker-host.reel'
            },
            statusColorMapping: {
                "UP": "green",
                "DOWN": "grey"
            },
            statusValueExpression: "state"
        }
    }
});
