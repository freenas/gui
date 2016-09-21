var Montage = require("montage").Montage;

exports.Alert = Montage.specialize({
    _active: {
        value: null
    },
    active: {
        set: function (value) {
            if (this._active !== value) {
                this._active = value;
            }
        },
        get: function () {
            return this._active;
        }
    },
    _cancelled_at: {
        value: null
    },
    cancelled_at: {
        set: function (value) {
            if (this._cancelled_at !== value) {
                this._cancelled_at = value;
            }
        },
        get: function () {
            return this._cancelled_at;
        }
    },
    _class: {
        value: null
    },
    class: {
        set: function (value) {
            if (this._class !== value) {
                this._class = value;
            }
        }, get: function () {
            return this._class;
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
    _dismissed: {
        value: null
    },
    dismissed: {
        set: function (value) {
            if (this._dismissed !== value) {
                this._dismissed = value;
            }
        },
        get: function () {
            return this._dismissed;
        }
    },
    _dismissed_at: {
        value: null
    },
    dismissed_at: {
        set: function (value) {
            if (this._dismissed_at !== value) {
                this._dismissed_at = value;
            }
        },
        get: function () {
            return this._dismissed_at;
        }
    },
    _happened_at: {
        value: null
    },
    happened_at: {
        set: function (value) {
            if (this._happened_at !== value) {
                this._happened_at = value;
            }
        },
        get: function () {
            return this._happened_at;
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
    _last_emitted_at: {
        value: null
    },
    last_emitted_at: {
        set: function (value) {
            if (this._last_emitted_at !== value) {
                this._last_emitted_at = value;
            }
        },
        get: function () {
            return this._last_emitted_at;
        }
    },
    _one_shot: {
        value: null
    },
    one_shot: {
        set: function (value) {
            if (this._one_shot !== value) {
                this._one_shot = value;
            }
        },
        get: function () {
            return this._one_shot;
        }
    },
    _send_count: {
        value: null
    },
    send_count: {
        set: function (value) {
            if (this._send_count !== value) {
                this._send_count = value;
            }
        },
        get: function () {
            return this._send_count;
        }
    },
    _severity: {
        value: null
    },
    severity: {
        set: function (value) {
            if (this._severity !== value) {
                this._severity = value;
            }
        },
        get: function () {
            return this._severity;
        }
    },
    _subtype: {
        value: null
    },
    subtype: {
        set: function (value) {
            if (this._subtype !== value) {
                this._subtype = value;
            }
        },
        get: function () {
            return this._subtype;
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
    _title: {
        value: null
    },
    title: {
        set: function (value) {
            if (this._title !== value) {
                this._title = value;
            }
        },
        get: function () {
            return this._title;
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
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "active",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "cancelled_at",
            valueType: "String"
        }, {
            mandatory: false,
            name: "class",
            valueObjectPrototypeName: "AlertClassId",
            valueType: "object"
        }, {
            mandatory: false,
            name: "description",
            valueType: "String"
        }, {
            mandatory: false,
            name: "dismissed",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "dismissed_at",
            valueType: "String"
        }, {
            mandatory: false,
            name: "happened_at",
            valueType: "String"
        }, {
            mandatory: false,
            name: "id",
            valueType: "number"
        }, {
            mandatory: false,
            name: "last_emitted_at",
            valueType: "String"
        }, {
            mandatory: false,
            name: "one_shot",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "send_count",
            valueType: "number"
        }, {
            mandatory: false,
            name: "severity",
            valueObjectPrototypeName: "AlertSeverity",
            valueType: "object"
        }, {
            mandatory: false,
            name: "subtype",
            valueType: "String"
        }, {
            mandatory: false,
            name: "target",
            valueType: "String"
        }, {
            mandatory: false,
            name: "title",
            valueType: "String"
        }, {
            mandatory: false,
            name: "type",
            valueObjectPrototypeName: "AlertType",
            valueType: "object"
        }, {
            mandatory: false,
            name: "user",
            valueType: "String"
        }]
    }
});
