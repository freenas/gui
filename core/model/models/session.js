var Montage = require("montage").Montage;

exports.Session = Montage.specialize({
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
    _ended_at: {
        value: null
    },
    ended_at: {
        set: function (value) {
            if (this._ended_at !== value) {
                this._ended_at = value;
            }
        },
        get: function () {
            return this._ended_at;
        }
    },
    _resource: {
        value: null
    },
    resource: {
        set: function (value) {
            if (this._resource !== value) {
                this._resource = value;
            }
        },
        get: function () {
            return this._resource;
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
    _tty: {
        value: null
    },
    tty: {
        set: function (value) {
            if (this._tty !== value) {
                this._tty = value;
            }
        },
        get: function () {
            return this._tty;
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
            name: "active",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "ended_at",
            valueType: "datetime"
        }, {
            mandatory: false,
            name: "resource",
            valueType: "String"
        }, {
            mandatory: false,
            name: "started_at",
            valueType: "datetime"
        }, {
            mandatory: false,
            name: "tty",
            valueType: "String"
        }, {
            mandatory: false,
            name: "username",
            valueType: "String"
        }]
    }
});
