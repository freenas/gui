var Montage = require("montage").Montage;

exports.Task = Montage.specialize({
    _args: {
        value: null
    },
    args: {
        set: function (value) {
            if (this._args !== value) {
                this._args = value;
            }
        },
        get: function () {
            return this._args;
        }
    },
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
    _debugger: {
        value: null
    },
    debugger: {
        set: function (value) {
            if (this._debugger !== value) {
                this._debugger = value;
            }
        },
        get: function () {
            return this._debugger;
        }
    },
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
    _error: {
        value: null
    },
    error: {
        set: function (value) {
            if (this._error !== value) {
                this._error = value;
            }
        },
        get: function () {
            return this._error;
        }
    },
    _finished_at: {
        value: null
    },
    finished_at: {
        set: function (value) {
            if (this._finished_at !== value) {
                this._finished_at = value;
            }
        },
        get: function () {
            return this._finished_at;
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
    _output: {
        value: null
    },
    output: {
        set: function (value) {
            if (this._output !== value) {
                this._output = value;
            }
        },
        get: function () {
            return this._output;
        }
    },
    _parent: {
        value: null
    },
    parent: {
        set: function (value) {
            if (this._parent !== value) {
                this._parent = value;
            }
        },
        get: function () {
            return this._parent;
        }
    },
    _resources: {
        value: null
    },
    resources: {
        set: function (value) {
            if (this._resources !== value) {
                this._resources = value;
            }
        },
        get: function () {
            return this._resources;
        }
    },
    _rusage: {
        value: null
    },
    rusage: {
        set: function (value) {
            if (this._rusage !== value) {
                this._rusage = value;
            }
        },
        get: function () {
            return this._rusage;
        }
    },
    _session: {
        value: null
    },
    session: {
        set: function (value) {
            if (this._session !== value) {
                this._session = value;
            }
        },
        get: function () {
            return this._session;
        }
    },
    _started_at: {
        value: null
    },
    started_at: {
        set: function (value) {
            if (this._started_at !== value) {
                this._started_at = value;
            }
        },
        get: function () {
            return this._started_at;
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
    _updated_at: {
        value: null
    },
    updated_at: {
        set: function (value) {
            if (this._updated_at !== value) {
                this._updated_at = value;
            }
        },
        get: function () {
            return this._updated_at;
        }
    },
    _user: {
        value: null
    },
    user: {
        set: function (value) {
            if (this._user !== value) {
                this._user = value;
            }
        },
        get: function () {
            return this._user;
        }
    },
    _warnings: {
        value: null
    },
    warnings: {
        set: function (value) {
            if (this._warnings !== value) {
                this._warnings = value;
            }
        },
        get: function () {
            return this._warnings;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "args",
            valueType: "object"
        }, {
            mandatory: false,
            name: "created_at",
            valueObjectPrototypeName: "IsoDatetime",
            valueType: "object"
        }, {
            mandatory: false,
            name: "debugger",
            valueType: "array"
        }, {
            mandatory: false,
            name: "description",
            valueType: "object"
        }, {
            mandatory: false,
            name: "error",
            valueObjectPrototypeName: "Error",
            valueType: "object"
        }, {
            mandatory: false,
            name: "finished_at",
            valueObjectPrototypeName: "IsoDatetime",
            valueType: "object"
        }, {
            mandatory: false,
            name: "id",
            valueType: "number"
        }, {
            mandatory: false,
            name: "name",
            valueType: "String"
        }, {
            mandatory: false,
            name: "output",
            valueType: "String"
        }, {
            mandatory: false,
            name: "parent",
            valueType: "number"
        }, {
            mandatory: false,
            name: "resources",
            valueType: "array"
        }, {
            mandatory: false,
            name: "rusage",
            valueObjectPrototypeName: "Rusage",
            valueType: "object"
        }, {
            mandatory: false,
            name: "session",
            valueType: "number"
        }, {
            mandatory: false,
            name: "started_at",
            valueObjectPrototypeName: "IsoDatetime",
            valueType: "object"
        }, {
            mandatory: false,
            name: "state",
            valueType: "String"
        }, {
            mandatory: false,
            name: "updated_at",
            valueObjectPrototypeName: "IsoDatetime",
            valueType: "object"
        }, {
            mandatory: false,
            name: "user",
            valueType: "String"
        }, {
            mandatory: false,
            name: "warnings",
            valueType: "array"
        }]
    }
});
