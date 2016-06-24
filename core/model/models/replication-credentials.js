var Montage = require("montage/core/core").Montage;

exports.ReplicationCredentials = Montage.specialize({
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
});
