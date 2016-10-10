var Montage = require("montage").Montage;

exports.ShareWebdav = Montage.specialize({
    "_%type": {
        value: null
    },
    "%type": {
        set: function (value) {
            if (this["_%type"] !== value) {
                this["_%type"] = value;
            }
        },
        get: function () {
            return this["_%type"];
        }
    },
    _permission: {
        value: null
    },
    permission: {
        set: function (value) {
            if (this._permission !== value) {
                this._permission = value;
            }
        },
        get: function () {
            return this._permission;
        }
    },
    _read_only: {
        value: null
    },
    read_only: {
        set: function (value) {
            if (this._read_only !== value) {
                this._read_only = value;
            }
        },
        get: function () {
            return this._read_only;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "%type"
        }, {
            mandatory: false,
            name: "permission",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "read_only",
            valueType: "boolean"
        }]
    }
});
