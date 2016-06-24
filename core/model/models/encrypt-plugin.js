var Montage = require("montage/core/core").Montage;

exports.EncryptPlugin = Montage.specialize({
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
    _read_fd: {
        value: null
    },
    read_fd: {
        set: function (value) {
            if (this._read_fd !== value) {
                this._read_fd = value;
            }
        },
        get: function () {
            return this._read_fd;
        }
    },
    _remote: {
        value: null
    },
    remote: {
        set: function (value) {
            if (this._remote !== value) {
                this._remote = value;
            }
        },
        get: function () {
            return this._remote;
        }
    },
    _renewal_interval: {
        value: null
    },
    renewal_interval: {
        set: function (value) {
            if (this._renewal_interval !== value) {
                this._renewal_interval = value;
            }
        },
        get: function () {
            return this._renewal_interval;
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
    },
    _write_fd: {
        value: null
    },
    write_fd: {
        set: function (value) {
            if (this._write_fd !== value) {
                this._write_fd = value;
            }
        },
        get: function () {
            return this._write_fd;
        }
    }
});
