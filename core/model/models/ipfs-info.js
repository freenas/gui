var Montage = require("montage/core/core").Montage;

exports.IpfsInfo = Montage.specialize({
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
});
