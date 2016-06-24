var Montage = require("montage/core/core").Montage;

exports.ShareIscsiUser = Montage.specialize({
    _name: {
        value: null
    },
    name: {
        set: function (value) {
            if (this._name !== value) {
                this._name = value;
            }
        },
        get: function () {
            return this._name;
        }
    },
    _peer_name: {
        value: null
    },
    peer_name: {
        set: function (value) {
            if (this._peer_name !== value) {
                this._peer_name = value;
            }
        },
        get: function () {
            return this._peer_name;
        }
    },
    _peer_secret: {
        value: null
    },
    peer_secret: {
        set: function (value) {
            if (this._peer_secret !== value) {
                this._peer_secret = value;
            }
        },
        get: function () {
            return this._peer_secret;
        }
    },
    _secret: {
        value: null
    },
    secret: {
        set: function (value) {
            if (this._secret !== value) {
                this._secret = value;
            }
        },
        get: function () {
            return this._secret;
        }
    }
});
