var Montage = require("montage").Montage;

exports.RemoteDebugStatus = Montage.specialize({
    _connected_at: {
        value: null
    },
    connected_at: {
        set: function (value) {
            if (this._connected_at !== value) {
                this._connected_at = value;
            }
        },
        get: function () {
            return this._connected_at;
        }
    },
    _connection_id: {
        value: null
    },
    connection_id: {
        set: function (value) {
            if (this._connection_id !== value) {
                this._connection_id = value;
            }
        },
        get: function () {
            return this._connection_id;
        }
    },
    _jobs: {
        value: null
    },
    jobs: {
        set: function (value) {
            if (this._jobs !== value) {
                this._jobs = value;
            }
        },
        get: function () {
            return this._jobs;
        }
    },
    _server: {
        value: null
    },
    server: {
        set: function (value) {
            if (this._server !== value) {
                this._server = value;
            }
        },
        get: function () {
            return this._server;
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
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "connected_at",
            valueType: "datetime"
        }, {
            mandatory: false,
            name: "connection_id",
            valueType: "String"
        }, {
            mandatory: false,
            name: "jobs",
            valueType: "array"
        }, {
            mandatory: false,
            name: "server",
            valueType: "String"
        }, {
            mandatory: false,
            name: "state",
            valueType: "String"
        }]
    }
});
