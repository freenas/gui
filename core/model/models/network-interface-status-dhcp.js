var Montage = require("montage/core/core").Montage;

exports.NetworkInterfaceStatusDhcp = Montage.specialize({
    _lease_ends_at: {
        value: null
    },
    lease_ends_at: {
        set: function (value) {
            if (this._lease_ends_at !== value) {
                this._lease_ends_at = value;
            }
        },
        get: function () {
            return this._lease_ends_at;
        }
    },
    _lease_starts_at: {
        value: null
    },
    lease_starts_at: {
        set: function (value) {
            if (this._lease_starts_at !== value) {
                this._lease_starts_at = value;
            }
        },
        get: function () {
            return this._lease_starts_at;
        }
    },
    _server_address: {
        value: null
    },
    server_address: {
        set: function (value) {
            if (this._server_address !== value) {
                this._server_address = value;
            }
        },
        get: function () {
            return this._server_address;
        }
    },
    _server_name: {
        value: null
    },
    server_name: {
        set: function (value) {
            if (this._server_name !== value) {
                this._server_name = value;
            }
        },
        get: function () {
            return this._server_name;
        }
    },
    _state: {
        value: null
    },
    state: {
        set: function (value) {
            if (this._state !== value) {
                this._state = value;
            }
        },
        get: function () {
            return this._state;
        }
    }
});
