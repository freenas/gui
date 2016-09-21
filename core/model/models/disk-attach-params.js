var Montage = require("montage").Montage;

exports.DiskAttachParams = Montage.specialize({
    _key: {
        value: null
    },
    key: {
        set: function (value) {
            if (this._key !== value) {
                this._key = value;
            }
        },
        get: function () {
            return this._key;
        }
    },
    _password: {
        value: null
    },
    password: {
        set: function (value) {
            if (this._password !== value) {
                this._password = value;
            }
        },
        get: function () {
            return this._password;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "key",
            valueType: "String"
        }, {
            mandatory: false,
            name: "password",
            valueType: "String"
        }]
    }
});
