var AbstractModel = require("core/model/abstract-model").AbstractModel;

exports.LdapConfig = AbstractModel.specialize({
    _binddn: {
        value: null
    },
    binddn: {
        set: function (value) {
            if (this._binddn !== value) {
                this._binddn = value;
            }
        },
        get: function () {
            return this._binddn;
        }
    },
    _bindpw: {
        value: null
    },
    bindpw: {
        set: function (value) {
            if (this._bindpw !== value) {
                this._bindpw = value;
            }
        },
        get: function () {
            return this._bindpw;
        }
    },
    _hostname: {
        value: null
    },
    hostname: {
        set: function (value) {
            if (this._hostname !== value) {
                this._hostname = value;
            }
        },
        get: function () {
            return this._hostname;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "binddn",
            valueType: "String"
        }, {
            mandatory: false,
            name: "bindpw",
            valueType: "String"
        }, {
            mandatory: false,
            name: "hostname",
            valueType: "String"
        }]
    }
});
