var Montage = require("montage").Montage;

exports.ThrottlePlugin = Montage.specialize({
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
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "buffer_size",
            valueType: "number"
        }, {
            mandatory: false,
            name: "name",
            valueType: "String"
        }, {
            mandatory: false,
            name: "read_fd",
            valueType: "fd"
        }, {
            mandatory: false,
            name: "write_fd",
            valueType: "fd"
        }]
    }
});
