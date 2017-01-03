var Montage = require("montage").Montage;

exports.ReplicationStatus = Montage.specialize({
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
    _message: {
        value: null
    },
    message: {
        set: function (value) {
            if (this._message !== value) {
                this._message = value;
            }
        },
        get: function () {
            return this._message;
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
    _speed: {
        value: null
    },
    speed: {
        set: function (value) {
            if (this._speed !== value) {
                this._speed = value;
            }
        },
        get: function () {
            return this._speed;
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
            name: "ended_at",
            valueType: "datetime"
        }, {
            mandatory: false,
            name: "message",
            valueType: "String"
        }, {
            mandatory: false,
            name: "size",
            valueType: "number"
        }, {
            mandatory: false,
            name: "speed",
            valueType: "number"
        }, {
            mandatory: false,
            name: "started_at",
            valueType: "datetime"
        }, {
            mandatory: false,
            name: "status",
            valueType: "String"
        }]
    }
});
