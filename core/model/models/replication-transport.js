var Montage = require("montage").Montage;

exports.ReplicationTransport = Montage.specialize({
    _auth_token: {
        value: null
    },
    auth_token: {
        set: function (value) {
            if (this._auth_token !== value) {
                this._auth_token = value;
            }
        },
        get: function () {
            return this._auth_token;
        }
    },
    _auth_token_size: {
        value: null
    },
    auth_token_size: {
        set: function (value) {
            if (this._auth_token_size !== value) {
                this._auth_token_size = value;
            }
        },
        get: function () {
            return this._auth_token_size;
        }
    },
    _buffer_size: {
        value: null
    },
    buffer_size: {
        set: function (value) {
            if (this._buffer_size !== value) {
                this._buffer_size = value;
            }
        },
        get: function () {
            return this._buffer_size;
        }
    },
    _client_address: {
        value: null
    },
    client_address: {
        set: function (value) {
            if (this._client_address !== value) {
                this._client_address = value;
            }
        },
        get: function () {
            return this._client_address;
        }
    },
    _estimated_size: {
        value: null
    },
    estimated_size: {
        set: function (value) {
            if (this._estimated_size !== value) {
                this._estimated_size = value;
            }
        },
        get: function () {
            return this._estimated_size;
        }
    },
    _receive_properties: {
        value: null
    },
    receive_properties: {
        set: function (value) {
            if (this._receive_properties !== value) {
                this._receive_properties = value;
            }
        },
        get: function () {
            return this._receive_properties;
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
    _server_port: {
        value: null
    },
    server_port: {
        set: function (value) {
            if (this._server_port !== value) {
                this._server_port = value;
            }
        },
        get: function () {
            return this._server_port;
        }
    },
    _transport_plugins: {
        value: null
    },
    transport_plugins: {
        set: function (value) {
            if (this._transport_plugins !== value) {
                this._transport_plugins = value;
            }
        },
        get: function () {
            return this._transport_plugins;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "auth_token",
            valueType: "String"
        }, {
            mandatory: false,
            name: "auth_token_size",
            valueType: "number"
        }, {
            mandatory: false,
            name: "buffer_size",
            valueType: "number"
        }, {
            mandatory: false,
            name: "client_address",
            valueType: "String"
        }, {
            mandatory: false,
            name: "estimated_size",
            valueType: "number"
        }, {
            mandatory: false,
            name: "receive_properties"
        }, {
            mandatory: false,
            name: "server_address",
            valueType: "String"
        }, {
            mandatory: false,
            name: "server_port",
            valueType: "number"
        }, {
            mandatory: false,
            name: "transport_plugins",
            valueType: "array"
        }]
    }
});
