var Montage = require("montage").Montage;

exports.FileIndex = Montage.specialize({
    _atime: {
        value: null
    },
    atime: {
        set: function (value) {
            if (this._atime !== value) {
                this._atime = value;
            }
        },
        get: function () {
            return this._atime;
        }
    },
    _ctime: {
        value: null
    },
    ctime: {
        set: function (value) {
            if (this._ctime !== value) {
                this._ctime = value;
            }
        },
        get: function () {
            return this._ctime;
        }
    },
    _gid: {
        value: null
    },
    gid: {
        set: function (value) {
            if (this._gid !== value) {
                this._gid = value;
            }
        },
        get: function () {
            return this._gid;
        }
    },
    _id: {
        value: null
    },
    id: {
        set: function (value) {
            if (this._id !== value) {
                this._id = value;
            }
        },
        get: function () {
            return this._id;
        }
    },
    _mtime: {
        value: null
    },
    mtime: {
        set: function (value) {
            if (this._mtime !== value) {
                this._mtime = value;
            }
        },
        get: function () {
            return this._mtime;
        }
    },
    _permissions: {
        value: null
    },
    permissions: {
        set: function (value) {
            if (this._permissions !== value) {
                this._permissions = value;
            }
        },
        get: function () {
            return this._permissions;
        }
    },
    _size: {
        value: null
    },
    size: {
        set: function (value) {
            if (this._size !== value) {
                this._size = value;
            }
        },
        get: function () {
            return this._size;
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
    _uid: {
        value: null
    },
    uid: {
        set: function (value) {
            if (this._uid !== value) {
                this._uid = value;
            }
        },
        get: function () {
            return this._uid;
        }
    },
    _volume: {
        value: null
    },
    volume: {
        set: function (value) {
            if (this._volume !== value) {
                this._volume = value;
            }
        },
        get: function () {
            return this._volume;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "atime",
            valueType: "datetime"
        }, {
            mandatory: false,
            name: "ctime",
            valueType: "datetime"
        }, {
            mandatory: false,
            name: "gid",
            valueType: "number"
        }, {
            mandatory: false,
            name: "id",
            valueType: "String"
        }, {
            mandatory: false,
            name: "mtime",
            valueType: "datetime"
        }, {
            mandatory: false,
            name: "permissions",
            valueObjectPrototypeName: "Permissions",
            valueType: "object"
        }, {
            mandatory: false,
            name: "size",
            valueType: "number"
        }, {
            mandatory: false,
            name: "type",
            valueType: "String"
        }, {
            mandatory: false,
            name: "uid",
            valueType: "number"
        }, {
            mandatory: false,
            name: "volume",
            valueType: "String"
        }]
    }
});
