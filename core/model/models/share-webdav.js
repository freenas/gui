var Montage = require("montage").Montage;

exports.ShareWebdav = Montage.specialize({
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
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "permission",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "read_only",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "type"
        }]
    }
});
