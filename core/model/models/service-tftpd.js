var Montage = require("montage").Montage;

exports.ServiceTftpd = Montage.specialize({
    _allow_new_files: {
        value: null
    },
    allow_new_files: {
        set: function (value) {
            if (this._allow_new_files !== value) {
                this._allow_new_files = value;
            }
        },
        get: function () {
            return this._allow_new_files;
        }
    },
    _auxiliary: {
        value: null
    },
    auxiliary: {
        set: function (value) {
            if (this._auxiliary !== value) {
                this._auxiliary = value;
            }
        },
        get: function () {
            return this._auxiliary;
        }
    },
    _enable: {
        value: null
    },
    enable: {
        set: function (value) {
            if (this._enable !== value) {
                this._enable = value;
            }
        },
        get: function () {
            return this._enable;
        }
    },
    _path: {
        value: null
    },
    path: {
        set: function (value) {
            if (this._path !== value) {
                this._path = value;
            }
        },
        get: function () {
            return this._path;
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
    _umask: {
        value: null
    },
    umask: {
        set: function (value) {
            if (this._umask !== value) {
                this._umask = value;
            }
        },
        get: function () {
            return this._umask;
        }
    },
    _username: {
        value: null
    },
    username: {
        set: function (value) {
            if (this._username !== value) {
                this._username = value;
            }
        },
        get: function () {
            return this._username;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "allow_new_files",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "auxiliary",
            valueType: "String"
        }, {
            mandatory: false,
            name: "enable",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "path",
            valueType: "String"
        }, {
            mandatory: false,
            name: "port",
            valueType: "number"
        }, {
            mandatory: false,
            name: "type"
        }, {
            mandatory: false,
            name: "umask",
            valueObjectPrototypeName: "UnixPermissions",
            valueType: "object"
        }, {
            mandatory: false,
            name: "username",
            valueType: "String"
        }]
    }
});
