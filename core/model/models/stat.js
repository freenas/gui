var Montage = require("montage").Montage;

exports.Stat = Montage.specialize({
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
            name: "mtime",
            valueType: "datetime"
        }, {
            mandatory: false,
            name: "path",
            valueType: "String"
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
        }]
    }
});
