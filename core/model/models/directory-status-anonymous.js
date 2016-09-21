var Montage = require("montage").Montage;

exports.DirectoryStatusAnonymous = Montage.specialize({
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
    _status_code: {
        value: null
    },
    status_code: {
        set: function (value) {
            if (this._status_code !== value) {
                this._status_code = value;
            }
        },
        get: function () {
            return this._status_code;
        }
    },
    _status_message: {
        value: null
    },
    status_message: {
        set: function (value) {
            if (this._status_message !== value) {
                this._status_message = value;
            }
        },
        get: function () {
            return this._status_message;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "state",
            valueType: "String"
        }, {
            mandatory: false,
            name: "status_code",
            valueType: "number"
        }, {
            mandatory: false,
            name: "status_message",
            valueType: "String"
        }]
    }
});
