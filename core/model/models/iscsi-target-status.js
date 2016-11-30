var Montage = require("montage").Montage;

exports.IscsiTargetStatus = Montage.specialize({
    _connected: {
        value: null
    },
    connected: {
        set: function (value) {
            if (this._connected !== value) {
                this._connected = value;
            }
        },
        get: function () {
            return this._connected;
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
            name: "connected",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "status",
            valueType: "String"
        }]
    }
});
