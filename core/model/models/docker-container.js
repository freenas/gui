var Montage = require("montage").Montage;

exports.DockerContainer = Montage.specialize({
    _autostart: {
        value: null
    },
    autostart: {
        set: function (value) {
            if (this._autostart !== value) {
                this._autostart = value;
            }
        },
        get: function () {
            return this._autostart;
        }
    },
    _bridge: {
        value: null
    },
    bridge: {
        set: function (value) {
            if (this._bridge !== value) {
                this._bridge = value;
            }
        },
        get: function () {
            return this._bridge;
        }
    },
    _command: {
        value: null
    },
    command: {
        set: function (value) {
            if (this._command !== value) {
                this._command = value;
            }
        },
        get: function () {
            return this._command;
        }
    },
    _environment: {
        value: null
    },
    environment: {
        set: function (value) {
            if (this._environment !== value) {
                this._environment = value;
            }
        },
        get: function () {
            return this._environment;
        }
    },
    _exec_ids: {
        value: null
    },
    exec_ids: {
        set: function (value) {
            if (this._exec_ids !== value) {
                this._exec_ids = value;
            }
        },
        get: function () {
            return this._exec_ids;
        }
    },
    _expose_ports: {
        value: null
    },
    expose_ports: {
        set: function (value) {
            if (this._expose_ports !== value) {
                this._expose_ports = value;
            }
        },
        get: function () {
            return this._expose_ports;
        }
    },
    _host: {
        value: null
    },
    host: {
        set: function (value) {
            if (this._host !== value) {
                this._host = value;
            }
        },
        get: function () {
            return this._host;
        }
    },
    _hostname: {
        value: null
    },
    hostname: {
        set: function (value) {
            if (this._hostname !== value) {
                this._hostname = value;
            }
        },
        get: function () {
            return this._hostname;
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
    _image: {
        value: null
    },
    image: {
        set: function (value) {
            if (this._image !== value) {
                this._image = value;
            }
        },
        get: function () {
            return this._image;
        }
    },
    _interactive: {
        value: null
    },
    interactive: {
        set: function (value) {
            if (this._interactive !== value) {
                this._interactive = value;
            }
        },
        get: function () {
            return this._interactive;
        }
    },
    _memory_limit: {
        value: null
    },
    memory_limit: {
        set: function (value) {
            if (this._memory_limit !== value) {
                this._memory_limit = value;
            }
        },
        get: function () {
            return this._memory_limit;
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
    _parent_directory: {
        value: null
    },
    parent_directory: {
        set: function (value) {
            if (this._parent_directory !== value) {
                this._parent_directory = value;
            }
        },
        get: function () {
            return this._parent_directory;
        }
    },
    _ports: {
        value: null
    },
    ports: {
        set: function (value) {
            if (this._ports !== value) {
                this._ports = value;
            }
        },
        get: function () {
            return this._ports;
        }
    },
    _running: {
        value: null
    },
    running: {
        set: function (value) {
            if (this._running !== value) {
                this._running = value;
            }
        },
        get: function () {
            return this._running;
        }
    },
    _settings: {
        value: null
    },
    settings: {
        set: function (value) {
            if (this._settings !== value) {
                this._settings = value;
            }
        },
        get: function () {
            return this._settings;
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
    },
    _volumes: {
        value: null
    },
    volumes: {
        set: function (value) {
            if (this._volumes !== value) {
                this._volumes = value;
            }
        },
        get: function () {
            return this._volumes;
        }
    },
    _web_ui_url: {
        value: null
    },
    web_ui_url: {
        set: function (value) {
            if (this._web_ui_url !== value) {
                this._web_ui_url = value;
            }
        },
        get: function () {
            return this._web_ui_url;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "autostart",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "bridge",
            valueType: "object"
        }, {
            mandatory: false,
            name: "command",
            valueType: "array"
        }, {
            mandatory: false,
            name: "environment",
            valueType: "array"
        }, {
            mandatory: false,
            name: "exec_ids",
            valueType: "array"
        }, {
            mandatory: false,
            name: "expose_ports",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "host",
            valueType: "String"
        }, {
            mandatory: false,
            name: "hostname",
            valueType: "String"
        }, {
            mandatory: false,
            name: "id",
            valueType: "String"
        }, {
            mandatory: false,
            name: "image",
            valueType: "String"
        }, {
            mandatory: false,
            name: "interactive",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "memory_limit",
            valueType: "number"
        }, {
            mandatory: false,
            name: "names",
            valueType: "array"
        }, {
            mandatory: false,
            name: "parent_directory",
            valueType: "String"
        }, {
            mandatory: false,
            name: "ports",
            valueType: "array"
        }, {
            mandatory: false,
            name: "running",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "settings",
            valueType: "array"
        }, {
            mandatory: false,
            name: "status",
            valueType: "String"
        }, {
            mandatory: false,
            name: "version",
            valueType: "number"
        }, {
            mandatory: false,
            name: "volumes",
            valueObjectPrototypeName: "DockerVolume",
            valueType: "array"
        }, {
            mandatory: false,
            name: "web_ui_url",
            valueType: "String"
        }]
    },
    userInterfaceDescriptor: {
        value: {
            inspectorComponentModule: {
                id: 'ui/sections/containers/inspectors/container.reel'
            },
            nameExpression: "id.defined() ? names.0 : 'Choose a collection'",
            collectionNameExpression: "'Containers'",
            creatorComponentModule: {
                id: 'ui/sections/containers/controls/docker-collection-list.reel'
            },
            statusColorMapping: {
                "running": "green",
                "stopped": "grey"
            },
            statusValueExpression: "running ? 'running' : 'stopped'",
            daoModuleId: "core/dao/docker-container-dao"
        }
    }
});
