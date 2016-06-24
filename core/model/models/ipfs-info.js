var AbstractModel = require("core/model/abstract-model").AbstractModel;

exports.IpfsInfo = AbstractModel.specialize({
    _Addresses: {
        value: null
    },
    Addresses: {
        set: function (value) {
            if (this._Addresses !== value) {
                this._Addresses = value;
            }
        },
        get: function () {
            return this._Addresses;
        }
    },
    _AgentVersion: {
        value: null
    },
    AgentVersion: {
        set: function (value) {
            if (this._AgentVersion !== value) {
                this._AgentVersion = value;
            }
        },
        get: function () {
            return this._AgentVersion;
        }
    },
    _ID: {
        value: null
    },
    ID: {
        set: function (value) {
            if (this._ID !== value) {
                this._ID = value;
            }
        },
        get: function () {
            return this._ID;
        }
    },
    _ProtocolVersion: {
        value: null
    },
    ProtocolVersion: {
        set: function (value) {
            if (this._ProtocolVersion !== value) {
                this._ProtocolVersion = value;
            }
        },
        get: function () {
            return this._ProtocolVersion;
        }
    },
    _PublicKey: {
        value: null
    },
    PublicKey: {
        set: function (value) {
            if (this._PublicKey !== value) {
                this._PublicKey = value;
            }
        },
        get: function () {
            return this._PublicKey;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "Addresses",
            valueType: "array"
        }, {
            mandatory: false,
            name: "AgentVersion",
            valueType: "String"
        }, {
            mandatory: false,
            name: "ID",
            valueType: "String"
        }, {
            mandatory: false,
            name: "ProtocolVersion",
            valueType: "String"
        }, {
            mandatory: false,
            name: "PublicKey",
            valueType: "String"
        }]
    }
});
