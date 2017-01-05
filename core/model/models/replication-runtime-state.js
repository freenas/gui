var Montage = require("montage").Montage;

exports.ReplicationRuntimeState = Montage.specialize({
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
    _progress: {
        value: null
    },
    progress: {
        set: function (value) {
            if (this._progress !== value) {
                this._progress = value;
            }
        },
        get: function () {
            return this._progress;
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
            name: "created_at",
            valueType: "datetime"
        }, {
            mandatory: false,
            name: "progress",
            valueType: "number"
        }, {
            mandatory: false,
            name: "speed",
            valueType: "String"
        }, {
            mandatory: false,
            name: "status"
        }]
    }
});
