var Montage = require("montage").Montage;

exports.RsyncCopy = Montage.specialize({
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
    _quiet: {
        value: null
    },
    quiet: {
        set: function (value) {
            if (this._quiet !== value) {
                this._quiet = value;
            }
        },
        get: function () {
            return this._quiet;
        }
    },
    _remote_host: {
        value: null
    },
    remote_host: {
        set: function (value) {
            if (this._remote_host !== value) {
                this._remote_host = value;
            }
        },
        get: function () {
            return this._remote_host;
        }
    },
    _remote_module: {
        value: null
    },
    remote_module: {
        set: function (value) {
            if (this._remote_module !== value) {
                this._remote_module = value;
            }
        },
        get: function () {
            return this._remote_module;
        }
    },
    _remote_path: {
        value: null
    },
    remote_path: {
        set: function (value) {
            if (this._remote_path !== value) {
                this._remote_path = value;
            }
        },
        get: function () {
            return this._remote_path;
        }
    },
    _remote_ssh_port: {
        value: null
    },
    remote_ssh_port: {
        set: function (value) {
            if (this._remote_ssh_port !== value) {
                this._remote_ssh_port = value;
            }
        },
        get: function () {
            return this._remote_ssh_port;
        }
    },
    _remote_user: {
        value: null
    },
    remote_user: {
        set: function (value) {
            if (this._remote_user !== value) {
                this._remote_user = value;
            }
        },
        get: function () {
            return this._remote_user;
        }
    },
    _rsync_direction: {
        value: null
    },
    rsync_direction: {
        set: function (value) {
            if (this._rsync_direction !== value) {
                this._rsync_direction = value;
            }
        },
        get: function () {
            return this._rsync_direction;
        }
    },
    _rsync_mode: {
        value: null
    },
    rsync_mode: {
        set: function (value) {
            if (this._rsync_mode !== value) {
                this._rsync_mode = value;
            }
        },
        get: function () {
            return this._rsync_mode;
        }
    },
    _rsync_properties: {
        value: null
    },
    rsync_properties: {
        set: function (value) {
            if (this._rsync_properties !== value) {
                this._rsync_properties = value;
            }
        },
        get: function () {
            return this._rsync_properties;
        }
    },
    _user: {
        value: null
    },
    user: {
        set: function (value) {
            if (this._user !== value) {
                this._user = value;
            }
        },
        get: function () {
            return this._user;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: true,
            name: "path",
            valueType: "String"
        }, {
            mandatory: true,
            name: "quiet",
            valueType: "boolean"
        }, {
            mandatory: true,
            name: "remote_host",
            valueType: "String"
        }, {
            mandatory: true,
            name: "remote_module",
            valueType: "String"
        }, {
            mandatory: true,
            name: "remote_path",
            valueType: "String"
        }, {
            mandatory: true,
            name: "remote_ssh_port",
            valueType: "number"
        }, {
            mandatory: true,
            name: "remote_user",
            valueType: "String"
        }, {
            mandatory: true,
            name: "rsync_direction",
            valueObjectPrototypeName: "RsyncCopyRsyncdirection",
            valueType: "object"
        }, {
            mandatory: true,
            name: "rsync_mode",
            valueObjectPrototypeName: "RsyncCopyRsyncmode",
            valueType: "object"
        }, {
            mandatory: true,
            name: "rsync_properties",
            valueType: "object"
        }, {
            mandatory: false,
            name: "user",
            valueType: "String"
        }]
    }
});
