var AbstractModel = require("core/model/abstract-model").AbstractModel;

exports.FreenasCredentials = AbstractModel.specialize({
    _address: {
        value: null
    },
    address: {
        set: function (value) {
            if (this._address !== value) {
                this._address = value;
            }
        },
        get: function () {
            return this._address;
        }
    },
    _hostkey: {
        value: null
    },
    hostkey: {
        set: function (value) {
            if (this._hostkey !== value) {
                this._hostkey = value;
            }
        },
        get: function () {
            return this._hostkey;
        }
    },
    _port: {
        value: null
    },
    port: {
        set: function (value) {
            if (this._port !== value) {
                this._port = value;
            }
        },
        get: function () {
            return this._port;
        }
    },
    _pubkey: {
        value: null
    },
    pubkey: {
        set: function (value) {
            if (this._pubkey !== value) {
                this._pubkey = value;
            }
        },
        get: function () {
            return this._pubkey;
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
            name: "address",
            valueType: "String"
        }, {
            mandatory: false,
            name: "hostkey",
            valueType: "String"
        }, {
            mandatory: false,
            name: "port",
            valueType: "number"
        }, {
            mandatory: false,
            name: "pubkey",
            valueType: "String"
        }, {
            mandatory: false,
            name: "type"
        }]
    }
});
