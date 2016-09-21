var Montage = require("montage").Montage;

exports.CalendarTask = Montage.specialize({
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
    _hidden: {
        value: null
    },
    hidden: {
        set: function (value) {
            if (this._hidden !== value) {
                this._hidden = value;
            }
        },
        get: function () {
            return this._hidden;
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
    _protected: {
        value: null
    },
    protected: {
        set: function (value) {
            if (this._protected !== value) {
                this._protected = value;
            }
        },
        get: function () {
            return this._protected;
        }
    },
    _schedule: {
        value: null
    },
    schedule: {
        set: function (value) {
            if (this._schedule !== value) {
                this._schedule = value;
            }
        },
        get: function () {
            return this._schedule;
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
    _task: {
        value: null
    },
    task: {
        set: function (value) {
            if (this._task !== value) {
                this._task = value;
            }
        },
        get: function () {
            return this._task;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "args",
            valueType: "array"
        }, {
            mandatory: false,
            name: "enabled",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "hidden",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "id",
            valueType: "String"
        }, {
            mandatory: false,
            name: "name",
            valueType: "String"
        }, {
            mandatory: false,
            name: "protected",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "schedule",
            valueType: "object"
        }, {
            mandatory: false,
            name: "status",
            valueObjectPrototypeName: "CalendarTaskStatus",
            valueType: "object"
        }, {
            mandatory: false,
            name: "task",
            valueType: "String"
        }]
    },
    userInterfaceDescriptor: {
        value: {
            inspectorComponentModule: {
                id: 'ui/inspectors/calendar-task.reel'
            },
            nameExpression: "name.defined() ? name : 'Create an event'"
        }
    }
});
